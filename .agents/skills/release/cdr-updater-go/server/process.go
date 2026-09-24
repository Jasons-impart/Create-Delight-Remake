package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"runtime"
	"sync"
)

func downloadProcesses(jobs []fetchJob, log func(string)) error {
	exe, err := os.Executable()
	if err != nil {
		return err
	}
	limit := processLimit
	if cpus := runtime.NumCPU(); cpus < limit {
		limit = cpus
	}
	if limit < 1 {
		limit = 1
	}
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	var mu sync.Mutex
	var joined error
	for _, job := range jobs {
		wg.Add(1)
		go func(job fetchJob) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			payload, err := json.Marshal(job)
			if err != nil {
				mu.Lock()
				joined = joinErr(joined, err)
				mu.Unlock()
				return
			}
			cmd := exec.Command(exe, "fetch-job")
			stdin, err := cmd.StdinPipe()
			if err != nil {
				mu.Lock()
				joined = joinErr(joined, err)
				mu.Unlock()
				return
			}
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Start(); err != nil {
				_ = stdin.Close()
				mu.Lock()
				joined = joinErr(joined, fmt.Errorf("%s: %w", job.Label, err))
				mu.Unlock()
				return
			}
			_, _ = io.WriteString(stdin, string(payload))
			_ = stdin.Close()
			if err := cmd.Wait(); err != nil {
				mu.Lock()
				joined = joinErr(joined, fmt.Errorf("%s: %w", job.Label, err))
				mu.Unlock()
			} else if log != nil {
				log("进程完成 " + job.Label)
			}
		}(job)
	}
	wg.Wait()
	return joined
}

func runFetchJob() error {
	var job fetchJob
	if err := json.NewDecoder(os.Stdin).Decode(&job); err != nil {
		return err
	}
	return downloadOne(job, func(line string) { fmt.Println(line) })
}

func joinErr(left, right error) error {
	if left == nil {
		return right
	}
	if right == nil {
		return left
	}
	return fmt.Errorf("%v; %w", left, right)
}
