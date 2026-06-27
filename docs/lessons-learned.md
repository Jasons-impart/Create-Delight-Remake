# Agent Lessons Learned

Historical project knowledge: non-obvious bugs, release pitfalls, and workflow details that future agents should not rediscover.

## KubeJS Recipes Are JS, Not JSON

**Problem**: Searching only `kubejs/data/**/*.json` misses most recipes.

**Lesson**: Recipe definitions usually live in `kubejs/server_scripts/**/*.js`; datapack JSON is only for overlay data such as loot, tags, advancements, and OEI replacements.

## Recipe Removal Should Prefer Exact IDs

**Problem**: Broad removals such as output/type filters can remove compatibility recipes that were added by other scripts or mods.

**Lesson**: Use `remove_recipes_id(e, [...])` when the exact recipe IDs are known; reserve broad `e.remove(...)` filters for intentional category-wide removals.

## Knife Recipes Need Tetra Compatibility

**Problem**: Adding only a Farmer's Delight cutting recipe can leave tetra modular knives unsupported.

**Lesson**: Use `cutting_2()` for knife recipes because it registers both the normal cutting recipe and tetra module support.

## Centrifuge Recipes Have Multiple Backends

**Problem**: Adding only one centrifuge recipe can make the same process unavailable in the other centrifuge machines.

**Lesson**: Use the `centrifugation()` proxy helper when Vintage Improvements, small centrifuge, and big centrifuge variants should all exist.

## Sequence Assembly Conflicts

**Problem**: Create sequenced assembly recipes with the same starting item can conflict when intermediate steps overlap.

**Lesson**: Check recipes that share the same initial item; without registered intermediate items, the final step of an N-step recipe must not duplicate another recipe's Nth step.

## Value System Exclusion

**Problem**: Setting an ignored item to value `0` still lets related recipes influence inferred values.

**Lesson**: Put ignored items in `ValueBlackList` when they should be skipped entirely by One Enough Value.

## Quality Food Material Whitelist

**Problem**: Food ingredients without `quality_food:material_whitelist` may not participate correctly in value and selling systems.

**Lesson**: Maintain common ingredients in the `quality_food:material_whitelist` tag unless they are intentionally excluded.

## Default Options Source

**Problem**: Editing only `options.txt` changes the local instance but not release defaults.

**Lesson**: Release default options should be maintained in `.options.txt`.

## Version Source

**Problem**: Duplicating version numbers across files creates stale release metadata.

**Lesson**: Treat `pack.toml` as the only version source; release automation should derive other versioned outputs.

## PowerShell Here-Doc Pitfall

**Problem**: Bash-style `<<EOF` heredocs do not work in PowerShell.

**Lesson**: Use PowerShell here-strings or temp files for multiline command input.

## GitHub CLI Markdown in PowerShell

**Problem**: Passing Markdown with backticks directly through PowerShell double-quoted `gh pr create/edit --body` arguments corrupts inline code because PowerShell treats backticks as escape characters.

**Lesson**: Write PR bodies to a UTF-8 file or single-quoted here-string and pass them with `gh pr create/edit --body-file`.

## Release Publish Must Be Resumable

**Problem**: An interrupted release can leave the tag pushed and CI completed, but no GitHub Release yet. Re-running a naive publish script then fails on `git tag`.

**Lesson**: If the existing local/remote tag points to the expected release commit, reuse it and continue with CI/artifact/release phases.

## Release Artifact Transfer on Windows

**Problem**: `gh run download` can hang on large artifacts, redirected Windows PowerShell can mis-decode Chinese workflow names, and artifact filenames such as `[Client]...zip` break non-literal path checks.

**Lesson**: Prefer authenticated `curl.exe` artifact downloads through the configured proxy, match Actions runs by `headSha`, use `git stash push -u` for dirty trees with untracked files, and use `-LiteralPath` for paths containing `[]`.

## Release Notes Need UTF-8 Files

**Problem**: v0.4.8.11 release notes were published with mojibake because Windows PowerShell decoded `git log` output incorrectly and passed multiline Chinese text through `gh --notes`.

**Lesson**: Set PowerShell output/console encoding to UTF-8, run `git -c i18n.logOutputEncoding=utf-8 log`, write release notes as UTF-8 no-BOM, and use `gh release create/edit --notes-file`.

## Release Cleanup Should Avoid Stderr Noise

**Problem**: A successful cleanup `git checkout` can write "Switched to branch" on stderr, and Windows PowerShell may display it as `NativeCommandError`.

**Lesson**: Restore the original release branch with quiet git commands, check `$LASTEXITCODE`, and only throw when the command really failed.

---

When adding entries, include Problem and Lesson, keep each item short, and remove entries that become common knowledge.
