//go:build linux && !cdrserver

package main

import (
	"fmt"
	"os"
	"os/exec"
)

func askMultiProcess(fileCount int) bool {
	text := fmt.Sprintf("即将下载 %d 个文件。\n\n开启多进程会同时下载多个文件，占用更多内存和网络。\n选「是」开启多进程，选「否」只在当前进程里多线程下载。", fileCount)
	if path, err := exec.LookPath("zenity"); err == nil {
		cmd := exec.Command(path, "--question", "--title=CDR 更新器", "--text="+text)
		return cmd.Run() == nil
	}
	if path, err := exec.LookPath("kdialog"); err == nil {
		cmd := exec.Command(path, "--title", "CDR 更新器", "--yesno", text)
		return cmd.Run() == nil
	}
	info, err := os.Stdin.Stat()
	if err != nil || info.Mode()&os.ModeCharDevice == 0 {
		fmt.Fprintln(os.Stderr, "没有图形确认框，改为当前进程多线程下载")
		return false
	}
	fmt.Fprintf(os.Stderr, "%s\n开启多进程下载？[y/N] ", text)
	var answer string
	_, _ = fmt.Scanln(&answer)
	return answer == "y" || answer == "Y" || answer == "yes"
}
