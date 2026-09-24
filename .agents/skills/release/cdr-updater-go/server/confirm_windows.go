//go:build windows && !cdrserver

package main

import (
	"fmt"
	"syscall"
	"unsafe"
)

func askMultiProcess(fileCount int) bool {
	title, err := syscall.UTF16PtrFromString("CDR 更新器")
	if err != nil {
		return false
	}
	text, err := syscall.UTF16PtrFromString(fmt.Sprintf("即将下载 %d 个文件。\n\n开启多进程会同时下载多个文件，占用更多内存和网络。\n选「是」开启多进程，选「否」只在当前进程里多线程下载。", fileCount))
	if err != nil {
		return false
	}
	proc := syscall.NewLazyDLL("user32.dll").NewProc("MessageBoxW")
	r, _, _ := proc.Call(0, uintptr(unsafe.Pointer(text)), uintptr(unsafe.Pointer(title)), 0x4|0x20|0x1000)
	return r == 6
}
