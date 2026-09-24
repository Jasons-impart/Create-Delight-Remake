package main

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	parallelMin  = 256 * 1024
	threadCount  = 16
	retryLimit   = 5
	processLimit = 4
)

type fetchJob struct {
	URL    string
	Dest   string
	SHA    string
	Label  string
	Size   int64
	Header map[string]string
}

var confirmMultiProcess = askMultiProcess

func downloadAll(jobs []fetchJob, prompt bool, log func(string)) error {
	if len(jobs) == 0 {
		return nil
	}
	if len(jobs) == 1 || !prompt {
		return downloadPool(jobs, log)
	}
	if !confirmMultiProcess(len(jobs)) {
		log("玩家未开启多进程，改为当前进程多线程下载")
		return downloadPool(jobs, log)
	}
	log(fmt.Sprintf("多进程下载 %d 个文件", len(jobs)))
	return downloadProcesses(jobs, log)
}

func downloadPool(jobs []fetchJob, log func(string)) error {
	workers := threadCount
	if workers > len(jobs) {
		workers = len(jobs)
	}
	if workers < 1 {
		workers = 1
	}
	errCh := make(chan error, len(jobs))
	queue := make(chan fetchJob)
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range queue {
				if err := downloadOne(job, log); err != nil {
					errCh <- fmt.Errorf("%s: %w", job.Label, err)
				}
			}
		}()
	}
	for _, job := range jobs {
		queue <- job
	}
	close(queue)
	wg.Wait()
	close(errCh)
	var joined error
	for err := range errCh {
		joined = errors.Join(joined, err)
	}
	return joined
}

func downloadOne(job fetchJob, log func(string)) error {
	if err := os.MkdirAll(filepath.Dir(job.Dest), 0o755); err != nil {
		return err
	}
	var last error
	for attempt := 1; attempt <= 2; attempt++ {
		err := downloadFile(job, log)
		if err == nil {
			if job.SHA == "" {
				return nil
			}
			sum, hashErr := hashFile(job.Dest)
			if hashErr != nil {
				return hashErr
			}
			if sum == job.SHA {
				return nil
			}
			_ = os.Remove(job.Dest)
			last = fmt.Errorf("哈希不一致")
			continue
		}
		last = err
		if !temporary(err) {
			return err
		}
	}
	return last
}

func downloadFile(job fetchJob, log func(string)) error {
	if job.Size >= parallelMin {
		ok, err := rangeSupported(job)
		if err != nil && temporary(err) {
			ok = false
		}
		if ok {
			log(fmt.Sprintf("多线程下载 %s · %d 线程", job.Label, threadCount))
			if err := downloadRanged(job, log); err == nil {
				return nil
			} else if !errors.Is(err, errNoRange) {
				return err
			}
			log("通道不支持分段，改单线程 " + job.Label)
		}
	}
	return downloadStream(job, log)
}

var errNoRange = errors.New("no range")

func rangeSupported(job fetchJob) (bool, error) {
	var code int
	err := withRetry(job.Label, func() error {
		req, err := http.NewRequest(http.MethodGet, job.URL, nil)
		if err != nil {
			return err
		}
		applyHeaders(req, job.Header)
		req.Header.Set("Range", "bytes=0-0")
		resp, err := client().Do(req)
		if err != nil {
			return err
		}
		io.Copy(io.Discard, resp.Body)
		resp.Body.Close()
		code = resp.StatusCode
		if code >= 500 || code == 408 || code == 429 {
			return &statusError{code}
		}
		return nil
	})
	if err != nil {
		return false, err
	}
	return code == http.StatusPartialContent, nil
}

func downloadRanged(job fetchJob, log func(string)) error {
	parts := threadCount
	piece := (job.Size + int64(parts) - 1) / int64(parts)
	dir := job.Dest + ".parts"
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	defer os.RemoveAll(dir)
	errCh := make(chan error, parts)
	var wg sync.WaitGroup
	for i := 0; i < parts; i++ {
		start := int64(i) * piece
		if start >= job.Size {
			break
		}
		end := start + piece - 1
		if end >= job.Size {
			end = job.Size - 1
		}
		wg.Add(1)
		go func(index int, start, end int64) {
			defer wg.Done()
			part := filepath.Join(dir, fmt.Sprintf("%02d", index))
			if err := downloadPiece(job, start, end, part, log); err != nil {
				errCh <- err
			}
		}(i, start, end)
	}
	wg.Wait()
	close(errCh)
	for err := range errCh {
		return err
	}
	out, err := os.Create(job.Dest)
	if err != nil {
		return err
	}
	defer out.Close()
	for i := 0; i < parts; i++ {
		part := filepath.Join(dir, fmt.Sprintf("%02d", i))
		if _, err := os.Stat(part); err != nil {
			if i > 0 && piece*int64(i) >= job.Size {
				break
			}
			return err
		}
		in, err := os.Open(part)
		if err != nil {
			return err
		}
		if _, err := io.Copy(out, in); err != nil {
			in.Close()
			return err
		}
		in.Close()
	}
	info, err := out.Stat()
	if err != nil {
		return err
	}
	if info.Size() != job.Size {
		return fmt.Errorf("下载不完整 %d/%d", info.Size(), job.Size)
	}
	log("下载完成 " + job.Label)
	return nil
}

func downloadPiece(job fetchJob, start, end int64, part string, log func(string)) error {
	return withRetry(job.Label, func() error {
		have := int64(0)
		if info, err := os.Stat(part); err == nil {
			have = info.Size()
		}
		span := end - start + 1
		if have > span {
			_ = os.Remove(part)
			have = 0
		}
		if have == span {
			return nil
		}
		req, err := http.NewRequest(http.MethodGet, job.URL, nil)
		if err != nil {
			return err
		}
		applyHeaders(req, job.Header)
		req.Header.Set("Range", fmt.Sprintf("bytes=%d-%d", start+have, end))
		resp, err := client().Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusPartialContent {
			return errNoRange
		}
		flags := os.O_CREATE | os.O_WRONLY
		if have > 0 {
			flags |= os.O_APPEND
		} else {
			flags |= os.O_TRUNC
		}
		file, err := os.OpenFile(part, flags, 0o644)
		if err != nil {
			return err
		}
		_, copyErr := io.Copy(file, resp.Body)
		closeErr := file.Close()
		if copyErr != nil {
			return copyErr
		}
		return closeErr
	})
}

func downloadStream(job fetchJob, log func(string)) error {
	return withRetry(job.Label, func() error {
		have := int64(0)
		if info, err := os.Stat(job.Dest); err == nil {
			have = info.Size()
			if job.Size > 0 && have > job.Size {
				_ = os.Remove(job.Dest)
				have = 0
			}
			if job.Size > 0 && have == job.Size {
				return nil
			}
		}
		req, err := http.NewRequest(http.MethodGet, job.URL, nil)
		if err != nil {
			return err
		}
		applyHeaders(req, job.Header)
		if have > 0 {
			req.Header.Set("Range", fmt.Sprintf("bytes=%d-", have))
		}
		resp, err := client().Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		if resp.StatusCode >= 400 {
			return &statusError{resp.StatusCode}
		}
		append := have > 0 && resp.StatusCode == http.StatusPartialContent
		if have > 0 && resp.StatusCode == http.StatusOK {
			_ = os.Remove(job.Dest)
			have = 0
			append = false
		}
		flags := os.O_CREATE | os.O_WRONLY
		if append {
			flags |= os.O_APPEND
		} else {
			flags |= os.O_TRUNC
		}
		file, err := os.OpenFile(job.Dest, flags, 0o644)
		if err != nil {
			return err
		}
		_, copyErr := io.Copy(file, resp.Body)
		closeErr := file.Close()
		if copyErr != nil {
			return copyErr
		}
		if closeErr != nil {
			return closeErr
		}
		if job.Size > 0 {
			info, err := os.Stat(job.Dest)
			if err != nil {
				return err
			}
			if info.Size() != job.Size {
				return fmt.Errorf("下载不完整 %d/%d", info.Size(), job.Size)
			}
		}
		log("下载完成 " + job.Label)
		return nil
	})
}

func withRetry(label string, fn func() error) error {
	delay := time.Second
	var last error
	for attempt := 1; attempt <= retryLimit; attempt++ {
		err := fn()
		if err == nil {
			return nil
		}
		if errors.Is(err, errNoRange) {
			return err
		}
		last = err
		if !temporary(err) || attempt == retryLimit {
			return err
		}
		fmt.Printf("连接中断，正在重试 %s（%d/%d）\n", label, attempt, retryLimit)
		time.Sleep(delay)
		if delay < 8*time.Second {
			delay *= 2
		}
	}
	return last
}

type statusError struct{ code int }

func (e *statusError) Error() string { return "http " + strconv.Itoa(e.code) }

func temporary(err error) bool {
	if err == nil || errors.Is(err, errNoRange) {
		return false
	}
	var status *statusError
	if errors.As(err, &status) {
		return status.code == 408 || status.code == 429 || status.code >= 500
	}
	var netErr net.Error
	if errors.As(err, &netErr) {
		return true
	}
	text := strings.ToLower(err.Error())
	for _, part := range []string{"timeout", "connection reset", "connection refused", "broken pipe", "eof", "wsarecv", "forcibly closed", "server closed", "temporary"} {
		if strings.Contains(text, part) {
			return true
		}
	}
	return false
}

func applyHeaders(req *http.Request, header map[string]string) {
	req.Header.Set("User-Agent", "cdr-updater")
	for key, value := range header {
		if value != "" {
			req.Header.Set(key, value)
		}
	}
}

func client() *http.Client {
	return &http.Client{Timeout: 2 * time.Minute}
}

func hashFile(path string) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	sum := sha256.New()
	if _, err := io.Copy(sum, file); err != nil {
		return "", err
	}
	return hex.EncodeToString(sum.Sum(nil)), nil
}
