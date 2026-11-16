//go:build !linux && !windows

package main

import "fmt"

func freeDiskBytes(path string) (int64, error) {
	return 0, fmt.Errorf("此平台无法检查磁盘余量")
}
