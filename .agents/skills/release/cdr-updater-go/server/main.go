package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "这个程序由启动器在开游戏时自动加载，不用手动打开。")
		os.Exit(0)
	}
	var err error
	switch os.Args[1] {
	case "fetch-job":
		err = runFetchJob()
	case "sync":
		err = runSync(os.Args[2:])
	case "serve":
		err = runServe(os.Args[2:])
	default:
		err = fmt.Errorf("未知命令 %s", os.Args[1])
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
