package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

const (
	githubParts = 16
	githubBuf   = 32 * 1024
	slowAfter   = 2 * time.Second
	slowFloor   = 256 * 1024
)

var errTooSlow = errors.New("too slow")

var githubMirrors = []string{
	"https://ghfast.top/",
	"https://gh.llkk.cc/",
	"https://github.moeyy.xyz/",
	"https://ghproxy.net/",
	"https://gh-proxy.com/",
	"",
}

var githubTransport = &http.Transport{
	Proxy:                 nil,
	MaxIdleConns:          64,
	MaxIdleConnsPerHost:   32,
	TLSHandshakeTimeout:   15 * time.Second,
	ResponseHeaderTimeout: 20 * time.Second,
	DisableCompression:    true,
}

func prefetchGithubZips(configPath string) error {
	version := tomlKey(configPath, "official", "version")
	repo := tomlKey(configPath, "official", "github_repo")
	api := tomlKey(configPath, "official", "github_api")
	dataDir := tomlKey(configPath, "server", "data_dir")
	if version == "" || repo == "" {
		return fmt.Errorf("配置里没有 GitHub 版本或仓库")
	}
	if api == "" {
		api = "https://api.github.com"
	}
	if dataDir == "" {
		dataDir = "./data"
	}
	if !filepath.IsAbs(dataDir) {
		dataDir = filepath.Join(filepath.Dir(configPath), dataDir)
	}
	cache := filepath.Join(dataDir, "cache", version)
	if err := os.MkdirAll(cache, 0o755); err != nil {
		return err
	}
	note("读取 GitHub Release " + version)
	body, err := httpGet(strings.TrimRight(api, "/")+"/repos/"+repo+"/releases/tags/"+version, 2*time.Minute)
	if err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(cache, "release.json"), body, 0o644); err != nil {
		return err
	}
	var release struct {
		Assets []struct {
			Name   string `json:"name"`
			Size   int64  `json:"size"`
			URL    string `json:"browser_download_url"`
			Digest string `json:"digest"`
		} `json:"assets"`
	}
	if err := json.Unmarshal(body, &release); err != nil {
		return err
	}
	var jobs []githubAsset
	for _, prefix := range []string{"Client-", "Server-"} {
		for _, asset := range release.Assets {
			if strings.HasPrefix(asset.Name, prefix) && strings.HasSuffix(asset.Name, ".zip") {
				dest := filepath.Join(cache, prefix+version+".zip")
				sha := sha256Digest(asset.Digest)
				adoptCachedZip(dest, filepath.Join(cache, asset.Name), asset.Size, sha)
				jobs = append(jobs, githubAsset{
					Name: asset.Name, Size: asset.Size, URL: asset.URL,
					SHA: sha, Dest: dest,
				})
				break
			}
		}
	}
	if len(jobs) == 0 {
		return fmt.Errorf("Release 没有客户端或服务端压缩包")
	}
	var pending []githubAsset
	var meters []*assetMeter
	var total int64
	for _, job := range jobs {
		if fileReady(job.Dest, job.Size, job.SHA) {
			note("已缓存 " + job.Name)
			continue
		}
		job.meter = &assetMeter{}
		meters = append(meters, job.meter)
		total += job.Size
		pending = append(pending, job)
	}
	if len(pending) == 0 {
		return nil
	}
	label := "下载官方包"
	if len(pending) > 1 {
		label = fmt.Sprintf("下载官方包 %d 个", len(pending))
	}
	progressDownloadStart(label, meters, total)
	defer progressEnd()
	sem := make(chan struct{}, githubParts*2)
	var wg sync.WaitGroup
	errCh := make(chan error, len(pending))
	for _, job := range pending {
		wg.Add(1)
		go func(job githubAsset) {
			defer wg.Done()
			if err := fetchGithubAsset(job, sem); err != nil {
				errCh <- err
			}
		}(job)
	}
	wg.Wait()
	close(errCh)
	for err := range errCh {
		return err
	}
	return nil
}

type githubAsset struct {
	Name  string
	Size  int64
	URL   string
	SHA   string
	Dest  string
	meter *assetMeter
}

func fetchGithubAsset(job githubAsset, sem chan struct{}) error {
	var last error
	for _, mirror := range githubMirrors {
		if job.meter != nil {
			job.meter.reset()
		}
		url := job.URL
		if mirror != "" {
			url = mirror + job.URL
		}
		note("下载 " + job.Name + " · " + hostOf(url))
		err := downloadGithub(url, mirror, job.Dest, job.Size, sem, job.meter)
		if err != nil {
			last = err
			if errors.Is(err, errTooSlow) {
				note("下载过慢 " + job.Name + " · " + hostOf(url) + "，换加速源")
			} else {
				note(job.Name + " 失败，换下一个地址: " + err.Error())
			}
			continue
		}
		if fileReady(job.Dest, job.Size, job.SHA) {
			note("下载完成 " + job.Name)
			return nil
		}
		_ = os.Remove(job.Dest)
		last = fmt.Errorf("%s 校验失败", job.Name)
	}
	if last == nil {
		last = fmt.Errorf("无法下载 %s", job.Name)
	}
	return last
}

func downloadGithub(rawURL, prefix, dest string, size int64, sem chan struct{}, meter *assetMeter) error {
	if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
		return err
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	bodyDone := make(chan struct{})
	go watchSlow(ctx, bodyDone, meter, size, cancel)
	err := downloadGithubOnce(ctx, rawURL, prefix, dest, size, sem, meter)
	close(bodyDone)
	if errors.Is(ctx.Err(), context.Canceled) && !errors.Is(err, context.Canceled) && err == nil {
		return errTooSlow
	}
	if errors.Is(err, context.Canceled) {
		return errTooSlow
	}
	return err
}

func watchSlow(ctx context.Context, done <-chan struct{}, meter *assetMeter, size int64, cancel context.CancelFunc) {
	timer := time.NewTimer(slowAfter)
	defer timer.Stop()
	var last int64
	for {
		select {
		case <-done:
			return
		case <-ctx.Done():
			return
		case <-timer.C:
			got := int64(0)
			if meter != nil {
				got = meter.done.Load()
			}
			if size > 0 && got >= size {
				return
			}
			if got-last < slowFloor {
				cancel()
				return
			}
			last = got
			timer.Reset(slowAfter)
		}
	}
}

func downloadGithubOnce(ctx context.Context, rawURL, prefix, dest string, size int64, sem chan struct{}, meter *assetMeter) error {
	partial := dest + ".partial"
	_ = os.Remove(partial)
	client := githubClient(prefix)
	if size < parallelMin {
		return streamToFile(ctx, client, rawURL, partial, dest, meter)
	}
	parts := githubParts
	piece := (size + int64(parts) - 1) / int64(parts)
	dir := dest + ".parts"
	_ = os.RemoveAll(dir)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	defer os.RemoveAll(dir)
	var wg sync.WaitGroup
	errCh := make(chan error, parts)
	for i := 0; i < parts; i++ {
		start := int64(i) * piece
		if start >= size {
			break
		}
		end := start + piece - 1
		if end >= size {
			end = size - 1
		}
		wg.Add(1)
		go func(index int, start, end int64) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			part := filepath.Join(dir, fmt.Sprintf("%02d", index))
			if err := streamRange(ctx, client, rawURL, part, start, end, meter); err != nil {
				errCh <- err
			}
		}(i, start, end)
	}
	wg.Wait()
	close(errCh)
	var hard error
	noRange := false
	for err := range errCh {
		if errors.Is(err, errNoRange) {
			noRange = true
			continue
		}
		if errors.Is(err, context.Canceled) {
			continue
		}
		hard = err
	}
	if hard != nil {
		return hard
	}
	if ctx.Err() != nil {
		return ctx.Err()
	}
	if noRange {
		if meter != nil {
			meter.reset()
		}
		return streamToFile(ctx, client, rawURL, partial, dest, meter)
	}
	out, err := os.Create(partial)
	if err != nil {
		return err
	}
	buf := make([]byte, githubBuf)
	for i := 0; i < parts; i++ {
		in, err := os.Open(filepath.Join(dir, fmt.Sprintf("%02d", i)))
		if err != nil {
			out.Close()
			return err
		}
		_, copyErr := io.CopyBuffer(out, in, buf)
		in.Close()
		if copyErr != nil {
			out.Close()
			return copyErr
		}
	}
	if err := out.Close(); err != nil {
		return err
	}
	return os.Rename(partial, dest)
}

func streamRange(ctx context.Context, client *http.Client, rawURL, dest string, start, end int64, meter *assetMeter) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "cdr-updater")
	req.Header.Set("Range", fmt.Sprintf("bytes=%d-%d", start, end))
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusPartialContent {
		return errNoRange
	}
	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = copyCounted(out, resp.Body, meter)
	return err
}

func streamToFile(ctx context.Context, client *http.Client, rawURL, partial, dest string, meter *assetMeter) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "cdr-updater")
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("http %d", resp.StatusCode)
	}
	out, err := os.Create(partial)
	if err != nil {
		return err
	}
	_, err = copyCounted(out, resp.Body, meter)
	closeErr := out.Close()
	if err != nil {
		return err
	}
	if closeErr != nil {
		return closeErr
	}
	return os.Rename(partial, dest)
}

func githubClient(prefix string) *http.Client {
	return &http.Client{
		Transport: githubTransport,
		Timeout:   30 * time.Minute,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= 8 {
				return errors.New("too many redirects")
			}
			if prefix == "" {
				return nil
			}
			loc := req.URL.String()
			if !strings.Contains(loc, "github.com/") && !strings.Contains(loc, "githubusercontent.com") {
				return nil
			}
			if strings.HasPrefix(loc, prefix) {
				return nil
			}
			next, err := url.Parse(prefix + loc)
			if err != nil {
				return err
			}
			req.URL = next
			return nil
		},
	}
}

func copyCounted(dst io.Writer, src io.Reader, meter *assetMeter) (int64, error) {
	buf := make([]byte, githubBuf)
	var total int64
	for {
		n, err := src.Read(buf)
		if n > 0 {
			written, werr := dst.Write(buf[:n])
			total += int64(written)
			meter.add(int64(written))
			if werr != nil {
				return total, werr
			}
			if written < n {
				return total, io.ErrShortWrite
			}
		}
		if err == io.EOF {
			return total, nil
		}
		if err != nil {
			return total, err
		}
	}
}

func httpGet(url string, timeout time.Duration) ([]byte, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "cdr-updater")
	resp, err := (&http.Client{Timeout: timeout}).Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("GitHub API 失败: %d", resp.StatusCode)
	}
	return body, nil
}

func adoptCachedZip(dest, alt string, size int64, sha string) {
	if dest == alt || fileReady(dest, size, sha) || !fileReady(alt, size, sha) {
		return
	}
	_ = os.Rename(alt, dest)
}

func fileReady(path string, size int64, sha string) bool {
	info, err := os.Stat(path)
	if err != nil || info.Size() != size || size <= 0 {
		return false
	}
	if sha == "" {
		return true
	}
	got, err := hashFile(path)
	return err == nil && strings.EqualFold(got, sha)
}

func sha256Digest(digest string) string {
	if i := strings.IndexByte(digest, ':'); i >= 0 && strings.HasPrefix(strings.ToLower(digest), "sha256") {
		return strings.TrimSpace(digest[i+1:])
	}
	return ""
}

func hostOf(url string) string {
	if i := strings.Index(url, "://"); i >= 0 {
		rest := url[i+3:]
		if j := strings.IndexByte(rest, '/'); j >= 0 {
			return rest[:j]
		}
		return rest
	}
	return url
}

func tomlKey(path, table, key string) string {
	buf, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	current := ""
	for _, line := range strings.Split(string(buf), "\n") {
		trim := strings.TrimSpace(line)
		if strings.HasPrefix(trim, "[") && strings.HasSuffix(trim, "]") {
			current = strings.Trim(trim, "[]")
			continue
		}
		if current == table && strings.HasPrefix(trim, key) {
			return tomlValue(trim)
		}
	}
	return ""
}
