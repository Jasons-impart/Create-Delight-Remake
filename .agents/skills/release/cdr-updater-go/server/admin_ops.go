package main

import (
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

var (
	liveMu         sync.Mutex
	liveCfg        serverConfig
	liveConfigPath string
	liveData       string
	opMu           sync.Mutex
	opBusy         bool
	opLogs         []string
)

func setLive(cfg serverConfig, configPath, data string) {
	liveMu.Lock()
	liveCfg = cfg
	liveConfigPath = configPath
	liveData = data
	liveMu.Unlock()
}

func liveSnapshot() serverConfig {
	liveMu.Lock()
	defer liveMu.Unlock()
	return liveCfg
}

func adminActivity() (bool, []string) {
	opMu.Lock()
	defer opMu.Unlock()
	out := append([]string{}, opLogs...)
	return opBusy, out
}

func note(line string) {
	opMu.Lock()
	opLogs = append(opLogs, line)
	if len(opLogs) > 200 {
		opLogs = opLogs[len(opLogs)-200:]
	}
	opMu.Unlock()
	fmt.Println(line)
}

func adminPost(w http.ResponseWriter, r *http.Request, fn func() (any, error)) {
	if r.Method != http.MethodPost {
		writeAdminError(w, http.StatusMethodNotAllowed, "方法不允许")
		return
	}
	if !adminAllowed(r) {
		writeAdminError(w, http.StatusUnauthorized, "请先登录管理网页")
		return
	}
	body, err := fn()
	if err != nil {
		writeAdminError(w, http.StatusConflict, err.Error())
		return
	}
	if body == nil {
		body = map[string]any{"ok": true}
	}
	writeHTTPJSON(w, body)
}

func applyVersion(r *http.Request) (any, error) {
	var body struct {
		Tag string `json:"tag"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("版本不能为空")
	}
	tag := strings.TrimSpace(body.Tag)
	if tag == "" {
		return nil, fmt.Errorf("版本不能为空")
	}
	if err := setToml("official", "version", tag); err != nil {
		return nil, err
	}
	note("已切换官方版本为 " + tag)
	if err := runJavaBuild(); err != nil {
		return nil, err
	}
	return map[string]any{"ok": true, "official_version": tag}, nil
}

func rebuildRepos() (any, error) {
	note("正在重新构建仓库")
	if err := runJavaBuild(); err != nil {
		return nil, err
	}
	note("仓库已重新构建")
	return map[string]any{"ok": true}, nil
}

func runJavaBuild() error {
	opMu.Lock()
	if opBusy {
		opMu.Unlock()
		return fmt.Errorf("正在处理上一项操作，请稍候")
	}
	opBusy = true
	opMu.Unlock()
	defer func() {
		opMu.Lock()
		opBusy = false
		opMu.Unlock()
	}()
	liveMu.Lock()
	configPath := liveConfigPath
	liveMu.Unlock()
	if err := prefetchGithubZips(configPath); err != nil {
		note("GitHub 预下载未完成，构建会继续自己拉取: " + err.Error())
	}
	java := `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\bin\java.exe`
	if _, err := os.Stat(java); err != nil {
		java = "java"
	}
	jar := filepath.Join(filepath.Dir(configPath), "cdr-updater.jar")
	cmd := exec.Command(java, "-jar", jar, "build", "--config", configPath)
	cmd.Dir = filepath.Dir(configPath)
	read, write, err := os.Pipe()
	if err != nil {
		return err
	}
	cmd.Stdout = write
	cmd.Stderr = write
	finished := make(chan struct{})
	go func() {
		streamBuildOutput(read)
		close(finished)
	}()
	runErr := cmd.Run()
	_ = write.Close()
	<-finished
	if runErr != nil {
		return fmt.Errorf("构建失败: %w", runErr)
	}
	return nil
}

func streamBuildOutput(r io.Reader) {
	buf := make([]byte, 4096)
	var pending []byte
	flush := func(chunk string, live bool) {
		line := strings.TrimSpace(strings.TrimRight(chunk, "\r"))
		if line == "" {
			return
		}
		if live || progressFromLine(line) {
			if live {
				progressFromLine(line)
			}
			return
		}
		note(line)
	}
	for {
		n, err := r.Read(buf)
		if n > 0 {
			pending = append(pending, buf[:n]...)
			for {
				i := bytesIndexAny(pending)
				if i < 0 {
					break
				}
				flush(string(pending[:i]), pending[i] == '\r')
				pending = pending[i+1:]
			}
			if len(pending) > 1<<20 {
				flush(string(pending), false)
				pending = nil
			}
		}
		if err != nil {
			break
		}
	}
	if len(pending) > 0 {
		flush(string(pending), false)
	}
}

func bytesIndexAny(buf []byte) int {
	for i, b := range buf {
		if b == '\n' || b == '\r' {
			return i
		}
	}
	return -1
}

func saveConnection(r *http.Request) (any, error) {
	var body struct {
		Listen      string `json:"listen"`
		Port        int    `json:"port"`
		PublicURL   string `json:"public_url"`
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, err
	}
	if body.Port <= 0 {
		return nil, fmt.Errorf("端口必须是数字")
	}
	listen := strings.TrimSpace(body.Listen)
	if listen == "" {
		listen = "127.0.0.1"
	}
	url := strings.TrimSpace(body.PublicURL)
	if url == "" {
		host := listen
		if host == "0.0.0.0" || host == "::" {
			host = "127.0.0.1"
		}
		url = fmt.Sprintf("http://%s:%d", host, body.Port)
	}
	if err := setToml("server", "listen", listen); err != nil {
		return nil, err
	}
	if err := setToml("server", "port", fmt.Sprint(body.Port)); err != nil {
		return nil, err
	}
	if err := setToml("server", "public_url", url); err != nil {
		return nil, err
	}
	if err := setToml("server", "access_token", strings.TrimSpace(body.AccessToken)); err != nil {
		return nil, err
	}
	liveMu.Lock()
	liveCfg.listen = listen
	liveCfg.port = fmt.Sprint(body.Port)
	liveMu.Unlock()
	note("客户端/服务端连接地址: " + url)
	return map[string]any{"ok": true, "listen": listen, "port": body.Port, "public_url": url, "access_token": strings.TrimSpace(body.AccessToken)}, nil
}

func detectWan() (any, error) {
	port := liveSnapshot().port
	addresses := localIPv4()
	publicIP := queryPublicIP()
	suggested := ""
	if publicIP != "" {
		suggested = "http://" + publicIP + ":" + port
	}
	note("建议地址 " + suggested)
	return map[string]any{"public_ip": publicIP, "suggested_url": suggested, "addresses": addresses}, nil
}

func openWan() (any, error) {
	report, err := detectWan()
	if err != nil {
		return nil, err
	}
	url, _ := report.(map[string]any)["suggested_url"].(string)
	if url == "" {
		return nil, fmt.Errorf("没有检测到公网地址")
	}
	port := liveSnapshot().port
	if runtime.GOOS == "windows" {
		name := "CDR Updater " + port
		_ = exec.Command("netsh", "advfirewall", "firewall", "delete", "rule", "name="+name).Run()
		cmd := exec.Command("netsh", "advfirewall", "firewall", "add", "rule", "name="+name, "dir=in", "action=allow", "protocol=TCP", "localport="+port, "profile=any")
		if out, err := cmd.CombinedOutput(); err != nil {
			note("防火墙放行失败: " + strings.TrimSpace(string(out)))
		} else {
			note("已放行 Windows 防火墙入站 TCP " + port)
		}
	}
	if err := setToml("server", "listen", "0.0.0.0"); err != nil {
		return nil, err
	}
	if err := setToml("server", "public_url", url); err != nil {
		return nil, err
	}
	liveMu.Lock()
	liveCfg.listen = "0.0.0.0"
	liveMu.Unlock()
	return map[string]any{"ok": true, "listen": "0.0.0.0", "public_url": url, "port": port}, nil
}

func addPrivate(r *http.Request) (any, error) {
	if err := r.ParseMultipartForm(80 << 20); err != nil {
		return nil, err
	}
	dest := r.FormValue("dest")
	side := strings.TrimSpace(r.FormValue("side"))
	var file multipart.File
	var header *multipart.FileHeader
	var err error
	file, header, err = r.FormFile("file")
	if err != nil {
		return nil, fmt.Errorf("请选择要上传的私货文件")
	}
	defer file.Close()
	rel := dest
	if rel == "" {
		rel = header.Filename
	}
	rel = filepath.ToSlash(rel)
	if rel == "" || strings.Contains(rel, "..") {
		return nil, fmt.Errorf("无效的游戏内路径")
	}
	root := filepath.Join(privateRoot(liveDataPath()), "files")
	target := filepath.Join(root, filepath.FromSlash(rel))
	if !strings.HasPrefix(filepath.Clean(target), filepath.Clean(root)) {
		return nil, fmt.Errorf("私货路径不能跳出 files 目录")
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return nil, err
	}
	out, err := os.Create(target)
	if err != nil {
		return nil, err
	}
	_, copyErr := io.Copy(out, file)
	_ = out.Close()
	if copyErr != nil {
		return nil, copyErr
	}
	sideFile := target + ".side"
	if side == "" || side == "auto" {
		_ = os.Remove(sideFile)
	} else {
		if err := os.WriteFile(sideFile, []byte(side), 0o644); err != nil {
			return nil, err
		}
	}
	note("已添加私货 " + rel)
	return map[string]any{"ok": true}, nil
}

func removePrivate(r *http.Request) (any, error) {
	var body struct {
		Path string `json:"path"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, err
	}
	rel := filepath.ToSlash(strings.TrimSpace(body.Path))
	if rel == "" || strings.Contains(rel, "..") {
		return nil, fmt.Errorf("请选择要删除的私货")
	}
	target := filepath.Join(privateRoot(liveDataPath()), "files", filepath.FromSlash(rel))
	if err := os.Remove(target); err != nil {
		return nil, fmt.Errorf("找不到私货: %s", rel)
	}
	_ = os.Remove(target + ".side")
	note("已删除私货 " + rel)
	return map[string]any{"ok": true}, nil
}

func setPrivateSide(r *http.Request) (any, error) {
	var body struct {
		Path string `json:"path"`
		Side string `json:"side"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, err
	}
	rel := filepath.ToSlash(strings.TrimSpace(body.Path))
	target := filepath.Join(privateRoot(liveDataPath()), "files", filepath.FromSlash(rel))
	if _, err := os.Stat(target); err != nil {
		return nil, fmt.Errorf("找不到私货: %s", rel)
	}
	side := strings.TrimSpace(body.Side)
	if side == "" || side == "auto" {
		_ = os.Remove(target + ".side")
	} else {
		if err := os.WriteFile(target+".side", []byte(side), 0o644); err != nil {
			return nil, err
		}
	}
	note("已将 " + rel + " 改为 " + side)
	return map[string]any{"ok": true}, nil
}

func createPrivateFolder(r *http.Request) (any, error) {
	var body struct {
		Path string `json:"path"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, err
	}
	rel := filepath.ToSlash(strings.Trim(strings.TrimSpace(body.Path), "/"))
	if rel == "" || strings.Contains(rel, "..") {
		return nil, fmt.Errorf("目录不能跳出 files")
	}
	target := filepath.Join(privateRoot(liveDataPath()), "files", filepath.FromSlash(rel))
	if err := os.MkdirAll(target, 0o755); err != nil {
		return nil, err
	}
	note("已创建目录 " + rel)
	return map[string]any{"ok": true, "path": rel + "/"}, nil
}

func setToml(table, key, value string) error {
	liveMu.Lock()
	path := liveConfigPath
	liveMu.Unlock()
	buf, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	lines := strings.Split(string(buf), "\n")
	current := ""
	found := false
	for i, line := range lines {
		trim := strings.TrimSpace(line)
		if strings.HasPrefix(trim, "[") && strings.HasSuffix(trim, "]") {
			current = strings.Trim(trim, "[]")
			continue
		}
		if current == table && strings.HasPrefix(trim, key) {
			lines[i] = key + " = \"" + strings.ReplaceAll(value, "\"", "") + "\""
			if key == "port" {
				lines[i] = key + " = " + value
			}
			found = true
			break
		}
	}
	if !found {
		return fmt.Errorf("配置里没有 %s.%s", table, key)
	}
	return os.WriteFile(path, []byte(strings.Join(lines, "\n")), 0o644)
}

func privateRoot(data string) string {
	dir := cfgField(data, "overlay_dir")
	if dir == "" {
		dir = "./private"
	}
	if filepath.IsAbs(dir) {
		return dir
	}
	return filepath.Join(filepath.Dir(data), dir)
}

func liveDataPath() string {
	liveMu.Lock()
	defer liveMu.Unlock()
	return liveData
}

func privateFolders(root string) []string {
	found := []string{}
	files := filepath.Join(root, "files")
	_ = filepath.Walk(files, func(path string, info os.FileInfo, err error) error {
		if err != nil || !info.IsDir() || path == files {
			return nil
		}
		rel, err := filepath.Rel(files, path)
		if err != nil {
			return nil
		}
		found = append(found, filepath.ToSlash(rel)+"/")
		return nil
	})
	return found
}

func sideLabel(side string) string {
	switch side {
	case "client":
		return "仅客户端"
	case "server":
		return "仅服务端"
	case "both":
		return "两端"
	default:
		return "自动判定"
	}
}

func loadServers(data string) []any {
	buf, err := os.ReadFile(filepath.Join(data, "server-connections.json"))
	if err != nil {
		return []any{}
	}
	var doc struct {
		Servers []any `json:"servers"`
	}
	if json.Unmarshal(buf, &doc) != nil || doc.Servers == nil {
		return []any{}
	}
	return doc.Servers
}

func localIPv4() []map[string]string {
	var rows []map[string]string
	ifaces, err := net.Interfaces()
	if err != nil {
		return rows
	}
	for _, iface := range ifaces {
		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}
		for _, addr := range addrs {
			ipnet, ok := addr.(*net.IPNet)
			if !ok || ipnet.IP.To4() == nil || ipnet.IP.IsLoopback() {
				continue
			}
			rows = append(rows, map[string]string{"iface": iface.Name, "ip": ipnet.IP.String(), "kind": "lan"})
		}
	}
	return rows
}

func queryPublicIP() string {
	client := &http.Client{Timeout: 8 * time.Second}
	for _, endpoint := range []string{"https://api.ipify.org", "https://ifconfig.me/ip"} {
		req, err := http.NewRequest(http.MethodGet, endpoint, nil)
		if err != nil {
			continue
		}
		req.Header.Set("User-Agent", "cdr-updater")
		resp, err := client.Do(req)
		if err != nil {
			continue
		}
		buf, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		ip := strings.TrimSpace(string(buf))
		if net.ParseIP(ip) != nil {
			return ip
		}
	}
	return ""
}
