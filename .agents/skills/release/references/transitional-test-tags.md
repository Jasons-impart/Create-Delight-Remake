# 标签与整合包版本不同的过渡测试发布

仅当用户明确要求 GitHub 测试标签使用 `-test`、但 `modpack.toml` 必须保留基础版本时使用。正常测试发布应让 `modpack.toml` 与标签都使用相同的 `-test` 版本。

1. 不运行 Prepare，也不编辑生成的 `pack.toml`。
2. 通过 `release-publish.ps1` 显式传入测试标签、目标分支、上一稳定版本和 `-ReleaseType '测试'`。
3. 在发布说明中标明这是过渡安排；后续版本恢复正常 Prepare 流程。

这不是长期发布模型。没有用户明确授权时，不要使用此例外。
