# Windows 与 GitHub 传输细节

运行发布脚本前应用项目的 PowerShell 约束。以下是发布特有的补充。

- 先完成 `gh auth status`，再通过 `-Proxy` 设置代理；Windows Keyring 在先设置代理时可能失效。
- `-Proxy` 会同时设置 `HTTPS_PROXY`、`HTTP_PROXY` 和 `ALL_PROXY`；海外访问慢时传入 `http://127.0.0.1:7890`。
- 公告参数是单个逗号分隔字符串，不是 PowerShell 字符串数组。
- 不手写 `gh pr create --body` 或 `gh release create --notes` 的多行内容；发布脚本使用临时 body/notes 文件。
- 大型 artifact 下载和上传由脚本通过 `curl --config -` 处理，并在代理可用时测量直连与代理的传输速度。
