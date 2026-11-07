# Offline regression tests: no Pester, network, gh auth, or real release writes needed.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
. "$PSScriptRoot/../.agents/skills/release/release-notes.ps1"
$script:count = 0
function Check($condition, [string]$message) {
    if (-not $condition) { throw "FAIL: $message" }
    $script:count++
}
function Throws([scriptblock]$action, [string]$pattern) {
    $threw = $false
    try { & $action } catch { $threw = $true; Check ($_.ToString() -match $pattern) "Expected '$pattern', got $_" }
    Check $threw "Expected failure: $pattern"
}
function Release($tag, $pre = $false, $draft = $false) {
    [pscustomobject]@{ tagName=$tag; isPrerelease=$pre; isDraft=$draft; publishedAt='2026-11-01T00:00:00Z' }
}
function Commit($subject, $paths = @('kubejs/server_scripts/recipe.js'), $sha = ('a' * 40)) {
    [pscustomobject]@{ Subject=$subject; Paths=$paths; Sha=$sha }
}
$history = @(
    (Release 'v0.5.0.9'), (Release 'v0.5.0.15'), (Release 'v0.5.0.17'),
    (Release 'v0.5.1.99'), (Release 'v0.5.0.99' $true),
    (Release 'v0.5.0.98' $false $true), (Release 'v0.5.0.16'),
    (Release 'v0.5.0.16-test'), (Release 'v0.5.0.18')
)
Check ((Resolve-PreviousFormalTag v0.5.0.17 $history) -eq 'v0.5.0.16') 'Same line, numeric predecessor, ignore self/future/drafts/prereleases'
Check ((Resolve-PreviousFormalTag v0.5.0.16 $history) -eq 'v0.5.0.15') 'Historical regeneration never uses current global latest'
Throws { Resolve-PreviousFormalTag v0.5.0.17 $history -PreviousVersion v0.5.0.15 } 'Formal baseline must be'
Check ((Resolve-PreviousFormalTag v0.6.0.1 $history -PreviousVersion v0.5.0.18) -eq 'v0.5.0.18') 'First formal on a new line requires explicit published formal baseline'
Throws { Resolve-PreviousFormalTag v0.6.0.1 $history } 'specify -PreviousVersion'
Throws { Resolve-PreviousFormalTag bad $history } 'Invalid version'
# Verify API pagination and normalization without making any network request.
function gh {
    Check (($args -join ' ') -match 'api --paginate --slurp repos/owner/repo/releases\?per_page=100') 'History fetch paginates all release pages'
    $global:LASTEXITCODE = 0
    '[[{"tag_name":"v0.5.0.16","draft":false,"prerelease":false,"published_at":"2026-11-01T00:00:00Z"}],[{"tag_name":"v0.5.0.15","draft":false,"prerelease":false,"published_at":"2026-10-01T00:00:00Z"}]]'
}
$apiHistory = @(Get-ReleaseHistory owner/repo)
Check ($apiHistory.Count -eq 2) 'Multiple API pages flattened'
Check ((Resolve-PreviousFormalTag v0.5.0.17 $apiHistory) -eq 'v0.5.0.16') 'REST metadata normalized correctly'
Remove-Item Function:gh
$commits = @(
    (Commit '[fix] 修复配方冲突 (#2)'),
    (Commit '[fix] 修复另一个问题 (#2446) (#5)'),
    (Commit '修复任务书错字' @('config/ftbquests/quests/a.snbt') ('b'*40))
)
Check ((Get-CommitPullRequestNumber $commits[1].Subject) -eq 5) 'Only final squash suffix is current PR'
Check ($null -eq (Get-CommitPullRequestNumber $commits[2].Subject)) 'Direct commits never get invented PRs'
$body = "**问题修复**`n- 修复配方冲突（[#2](https://github.com/owner/repo/pull/2)、[#5](https://github.com/owner/repo/pull/5)）`n`n**任务书与文本**`n- 修复任务书错字（[提交 bbbbbbb](https://github.com/owner/repo/commit/$('b'*40))）"
$notes = New-ReleaseNotes -Version v0.5.0.17 -PreviousVersion v0.5.0.16 -Repository owner/repo -Commits $commits -CuratedContent $body
Check ($notes.Contains('AI自动生成')) 'AI attribution now describes agent-authored content'
Check ($notes.Contains('compare/v0.5.0.16...v0.5.0.17') -and $notes.Contains('从 v0.5.0.16 更新')) 'Same baseline in compare and incremental instructions'
Check ($notes.Contains($body)) 'Agent wording is preserved verbatim without keyword classification'
Throws { New-ReleaseNotes -Commits $commits } 'required'
Throws { New-ReleaseNotes -Repository owner/repo -CuratedContent $body } 'No commits'
Throws { Assert-CuratedNotes ($body + ' [#99](https://github.com/other/repo/pull/99)') owner/repo $commits } 'only repository'
Throws { Assert-CuratedNotes '' owner/repo } 'required'
Throws { Assert-CuratedNotes '   ' owner/repo } 'required'
Throws { Assert-CuratedNotes '**其他**' owner/repo } 'Invalid or duplicate'
Throws { Assert-CuratedNotes "**问题修复**`n- 修复HotAI问题" owner/repo } 'internal jargon'
Throws { Assert-CuratedNotes "**问题修复**`n- fix recipe ([提交](https://github.com/owner/repo/pull/2))" owner/repo } 'Untranslated'
Throws { Assert-CuratedNotes "**问题修复**`n- 修复配方" owner/repo } 'needs a repository'
Throws { Assert-CuratedNotes "**问题修复**`n- 修复配方（[#99](https://github.com/owner/repo/pull/99)）" owner/repo $commits } 'outside the release range'
Throws { Assert-CuratedNotes ($body + "`n**模组与光影更新**") owner/repo } 'non-empty'
Throws { Assert-CuratedNotes ($body + "`n**增量更新**") owner/repo } 'Invalid or duplicate'
Throws { Assert-CuratedNotes ($body + "`n**问题修复**") owner/repo } 'Invalid or duplicate'
Throws { Assert-CuratedNotes ('## 更新内容' + "`n" + $body) owner/repo } 'Malformed'
$testNotes = New-ReleaseNotes -ReleaseType 测试 -Version v0.5.0.17-test -PreviousVersion v0.5.0.16 -Repository owner/repo -CuratedContent $body -Commits $commits
Check ($testNotes -match '测试版不提供 Patch') 'Prerelease has no incremental artifacts'
# Actual git fixture; PR metadata/files are mocked and no network request is possible.
$temp = Join-Path ([IO.Path]::GetTempPath()) ('release-notes-test-' + [guid]::NewGuid())
try {
    [void](New-Item -ItemType Directory $temp)
    $publisher = "$PSScriptRoot/../.agents/skills/release/release-publish.ps1"
    Throws { & $publisher -Version v9.9.9.1 -TargetBranch invalid -NotesFile "$temp/missing.md" -WhatIf } 'Cannot find path'
    Set-Content "$temp/invalid.md" '# raw titles are not release notes'
    Throws { & $publisher -Version v9.9.9.1 -TargetBranch invalid -NotesFile "$temp/invalid.md" -WhatIf } 'Malformed notes'
    Remove-Item "$temp/invalid.md"
    & git -C $temp init -q
    & git -C $temp config user.name 'Offline Test'
    & git -C $temp config user.email 'test@example.invalid'
    Set-Content "$temp/file.txt" 'before'
    & git -C $temp add .
    & git -C $temp commit -qm '旧版内容 (#1)'
    & git -C $temp tag v0.5.0.16
    Set-Content "$temp/file.txt" 'after'
    & git -C $temp commit -qam "修复新版问题 (#2)`n`n完整提交说明"
    & git -C $temp tag v0.5.0.17
    Assert-ReleaseRange v0.5.0.17 v0.5.0.16 $temp
    $range = @(Get-ReleaseCommits v0.5.0.16 v0.5.0.17 $temp)
    Check ($range.Count -eq 1 -and $range[0].Subject -eq '修复新版问题 (#2)') 'Only new range commits included'
    Check ($range[0].Paths -contains 'file.txt') 'Direct commits retain changed paths'
    Check ($range[0].Message -match '完整提交说明') 'Full commit body retained'
    Throws { Assert-ReleaseRange v0.5.0.16 v0.5.0.17 $temp } 'not an ancestor'
    Throws { Assert-ReleaseRange v0.5.0.18 v0.5.0.16 $temp } 'Target ref not found'
    # Gather before a tag exists, pinning target commit; export all metadata without filtering.
    function gh {
        $global:LASTEXITCODE = 0
        if ($args[0] -eq 'pr') {
            Check (($args -join ' ') -match 'pr view 2 --repo owner/repo') 'Correct range PR requested'
            '{"number":2,"title":"修复新版问题","body":"完整 PR 说明","labels":[{"name":"fix"}],"url":"https://github.com/owner/repo/pull/2","state":"MERGED"}'
        } elseif ($args[0] -eq 'api') {
            Check (($args -join ' ') -match '--paginate --slurp') 'Changed files paginate all pages'
            '[[{"filename":"a.txt","status":"modified","additions":2,"deletions":1}],[{"filename":"b.txt","status":"added","additions":1,"deletions":0}]]'
        } else { throw 'Unexpected external query' }
    }
    $inputData = Get-ReleaseNotesInput -Version v0.5.0.18 -PreviousVersion v0.5.0.16 -TargetRef HEAD -RepoRoot $temp -Repository owner/repo
    Check ($inputData.pullRequests.Count -eq 1) 'Only PRs from exact range exported'
    Check ($inputData.pullRequests[0].body -eq '完整 PR 说明') 'PR body retained for agent understanding'
    Check ($inputData.pullRequests[0].labels[0].name -eq 'fix') 'PR labels retained'
    Check ($inputData.pullRequests[0].changedFiles.Count -eq 2) 'Multi-page changed-file summaries retained'
    Check ($inputData.targetCommit -eq $range[0].Sha) 'Pre-tag input pins exact target SHA'
    function gh { $global:LASTEXITCODE=1; return '' }
    Throws { Get-ReleaseNotesInput -Version v0.5.0.17 -PreviousVersion v0.5.0.16 -TargetRef HEAD -RepoRoot $temp -Repository owner/repo } 'refusing incomplete'
    Remove-Item Function:gh
} finally { Remove-Item -LiteralPath $temp -Recurse -Force }
$publish = Get-Content "$PSScriptRoot/../.agents/skills/release/release-publish.ps1" -Raw
Check ($publish.IndexOf('Assert-CuratedNotes -Content $curatedContent') -lt $publish.IndexOf('git tag $Version')) 'Missing/malformed notes block before even local tag creation'
Check ($publish.IndexOf('$ReleaseNotes = New-ReleaseNotes') -lt $publish.IndexOf('git push origin $Version')) 'Final range-validated body exists before tag push'
Check ($publish -notmatch 'ConvertTo-PlayerNote|\$grouped =|\$categories =') 'No script keyword classifier fallback'
Write-Host "PASS: $script:count offline release-note assertions"
