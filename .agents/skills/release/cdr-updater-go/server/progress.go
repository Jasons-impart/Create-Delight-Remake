package main

import (
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

type assetMeter struct {
	done atomic.Int64
}

func (m *assetMeter) add(n int64) {
	if m != nil && n > 0 {
		m.done.Add(n)
	}
}

func (m *assetMeter) reset() {
	if m != nil {
		m.done.Store(0)
	}
}

type progState struct {
	mu           sync.Mutex
	active       bool
	external     bool
	label        string
	text         string
	percent      int
	total        int64
	meters       []*assetMeter
	speed        int64
	speedAt      time.Time
	speedAtBytes int64
}

var prog progState

func progressDownloadStart(label string, meters []*assetMeter, total int64) {
	prog.mu.Lock()
	defer prog.mu.Unlock()
	prog.active = true
	prog.external = false
	prog.label = label
	prog.text = ""
	prog.percent = 0
	prog.total = total
	prog.meters = meters
	prog.speed = 0
	prog.speedAt = time.Now()
	prog.speedAtBytes = 0
}

func progressFromLine(line string) bool {
	line = strings.TrimSpace(line)
	if !looksProgress(line) {
		return false
	}
	prog.mu.Lock()
	defer prog.mu.Unlock()
	if prog.active && !prog.external && len(prog.meters) > 0 {
		return true
	}
	prog.active = true
	prog.external = true
	prog.label = line
	prog.text = line
	prog.percent = parsePercent(line)
	prog.meters = nil
	return true
}

func progressEnd() {
	prog.mu.Lock()
	prog.active = false
	prog.external = false
	prog.label = ""
	prog.text = ""
	prog.percent = -1
	prog.total = -1
	prog.meters = nil
	prog.speed = 0
	prog.speedAt = time.Time{}
	prog.speedAtBytes = 0
	prog.mu.Unlock()
}

func progressSnapshot() map[string]any {
	prog.mu.Lock()
	defer prog.mu.Unlock()
	if !prog.active {
		return map[string]any{
			"active": false, "label": "", "done": int64(0), "total": int64(-1),
			"index": 0, "count": 0, "percent": -1, "speed": int64(0), "text": "",
		}
	}
	if prog.external {
		return map[string]any{
			"active": true, "label": prog.label, "done": int64(0), "total": int64(-1),
			"index": 0, "count": 0, "percent": prog.percent, "speed": int64(0), "text": prog.text,
		}
	}
	var done int64
	for _, meter := range prog.meters {
		done += meter.done.Load()
	}
	if prog.total > 0 && done > prog.total {
		done = prog.total
	}
	now := time.Now()
	elapsed := now.Sub(prog.speedAt)
	if elapsed >= 400*time.Millisecond && done >= prog.speedAtBytes {
		prog.speed = (done - prog.speedAtBytes) * int64(time.Second) / int64(elapsed)
	}
	if elapsed >= 2*time.Second {
		prog.speedAt = now
		prog.speedAtBytes = done
	}
	pct := -1
	if prog.total > 0 {
		pct = int((done*100 + prog.total/2) / prog.total)
		if pct > 100 {
			pct = 100
		}
	}
	return map[string]any{
		"active": true, "label": prog.label, "done": done, "total": prog.total,
		"index": 0, "count": len(prog.meters), "percent": pct, "speed": prog.speed,
		"text": progressText(prog.label, done, prog.total, pct, prog.speed),
	}
}

func progressText(label string, done, total int64, pct int, speed int64) string {
	var b strings.Builder
	if label != "" {
		b.WriteString(label)
	}
	if pct >= 0 {
		b.WriteString("  ")
		b.WriteString(strconv.Itoa(pct))
		b.WriteString("%  ")
		b.WriteString(formatSize(done))
		b.WriteString("/")
		b.WriteString(formatSize(total))
	} else if done > 0 {
		b.WriteString("  ")
		b.WriteString(formatSize(done))
	}
	if speed > 0 {
		b.WriteString("  ")
		b.WriteString(formatSize(speed))
		b.WriteString("/s")
	} else if total > 0 && done < total {
		b.WriteString("  连接中")
	}
	return strings.TrimSpace(b.String())
}

func formatSize(bytes int64) string {
	if bytes < 1024 {
		return strconv.FormatInt(bytes, 10) + " B"
	}
	if bytes < 1024*1024 {
		return trimFloat(float64(bytes)/1024, 1) + " KB"
	}
	if bytes < 1024*1024*1024 {
		return trimFloat(float64(bytes)/1048576, 1) + " MB"
	}
	return trimFloat(float64(bytes)/1073741824, 2) + " GB"
}

func trimFloat(v float64, digits int) string {
	s := strconv.FormatFloat(v, 'f', digits, 64)
	return s
}

func looksProgress(line string) bool {
	if !strings.Contains(line, "%") {
		return false
	}
	return strings.Contains(line, " B") || strings.Contains(line, " KB") ||
		strings.Contains(line, " MB") || strings.Contains(line, " GB")
}

func parsePercent(line string) int {
	i := strings.LastIndex(line, "%")
	if i <= 0 {
		return -1
	}
	j := i
	for j > 0 && line[j-1] >= '0' && line[j-1] <= '9' {
		j--
	}
	if j == i {
		return -1
	}
	n, err := strconv.Atoi(line[j:i])
	if err != nil || n > 100 {
		return -1
	}
	return n
}
