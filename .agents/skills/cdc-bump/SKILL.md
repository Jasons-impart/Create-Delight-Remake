---
name: cdc-bump
description: Bump or change Create Delight Core (CDC) inside Create-Delight-Remake. Use when updating the CDC-mod-src submodule pointer, packaging a new Create-Delight-Core jar, editing mods/create-delight-core.pw.toml, or opening a Remake PR that depends on a Create-Delight-Core change.
---

# CDC Submodule Bump

Use this workflow whenever a Remake change depends on Create Delight Core source or its packaged jar. The goal is that every mergeable Remake PR pins `CDC-mod-src` to a commit that already exists on Create-Delight-Core `1.20.1`, never to an unmerged Core feature-branch tip.

## Hard Rules

- Order is fixed: **Core PR squash-merged into `1.20.1` → pin Remake `CDC-mod-src` to that merge SHA → same Remake commit updates the packwiz jar + `mods/create-delight-core.pw.toml`** (and Crash Assistant baseline when the jar filename/hash changes).
- ❌ Do **not** leave a Ready / mergeable Remake PR pointing at an unmerged Core branch tip. Draft Remake PRs may temporarily track a Core tip for local pairing; before Ready or merge, retarget the gitlink to the post-squash commit on `1.20.1`.
- After Core squash-merge, **re-fetch** Core: `git ls-remote` / `git fetch` / `git rev-parse origin/1.20.1`. Squash changes the SHA; the pre-merge tip is wrong.
- On `release-v050x` (and other CDC-frozen `release-vxxxx` lines): **do not bump CDC** for mixin fixes. Prefer HotAI / pack-side fixes. See `docs/dev-knowledge/branch-and-release.md`.
- Before opening or marking Ready a Remake PR that touches the gitlink, jar, or `create-delight-core.pw.toml`, run `scripts/check-cdc-submodule.sh`. It must exit 0 (`git merge-base --is-ancestor <gitlink> origin/1.20.1` on Core).

## Workflow

1. Land the Core change first in [Create-Delight-Core](https://github.com/Jasons-impart/Create-Delight-Core):
   - Open / merge the Core PR into `1.20.1` (squash is normal).
   - Record the **post-merge** SHA on `1.20.1`, not the feature-branch tip:

```bash
git -C CDC-mod-src fetch origin 1.20.1
git -C CDC-mod-src rev-parse origin/1.20.1
```

2. On the Remake feature branch (from `main`, unless the user named another non-frozen target):

```bash
git fetch origin main
git checkout -B feat/cdc-bump-<topic> origin/main
git -C CDC-mod-src fetch origin 1.20.1
git -C CDC-mod-src checkout "$(git -C CDC-mod-src rev-parse origin/1.20.1)"
```

3. Build or copy the matching CDC jar into `packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar`, then update Packwiz metadata per `.agents/skills/packwiz-assets/SKILL.md` → **CDC Packaged Jar**:
   - Refresh `mods/create-delight-core.pw.toml` hash (and `[release.curseforge]` only when a published CF build exists).
   - On short-lived branches keep the raw URL on `main`; do not run full metadata reconcile.
   - If the jar / CF filename changed, regenerate Crash Assistant baseline (`python scripts/generate-crash-assistant-modlist.py`).

4. Stage **together** in one Remake commit: `CDC-mod-src` gitlink + jar payload + `mods/create-delight-core.pw.toml` (+ baseline if needed).

5. Self-check before PR / Ready:

```bash
./scripts/check-cdc-submodule.sh
```

6. Open the Remake PR to `main`. CI workflow `Validate CDC submodule` runs the same script when the PR touches `CDC-mod-src`, the CDC jar under `packwiz-files/mods/`, or `mods/create-delight-core.pw.toml`.

## Draft pairing (temporary only)

Local pairing against an unmerged Core PR is allowed **only** while the Remake PR stays draft:

1. Point `CDC-mod-src` at the Core PR head for build/test.
2. Keep Remake PR draft; do not request merge.
3. After Core squash-lands on `1.20.1`, retarget gitlink to `origin/1.20.1`, refresh jar/toml, re-run `./scripts/check-cdc-submodule.sh`, then mark Ready.

## Anti-patterns

- ❌ Pinning Remake to Core feature-branch tip and opening a Ready PR “to save a round trip”.
- ❌ Updating only the jar or only the gitlink so source and packaged artifact disagree.
- ❌ Assuming the Core PR branch tip SHA survives squash-merge.
- ❌ Bumping CDC on a CDC-frozen `release-vxxxx` line for mixin work (use HotAI / pack-side instead).
- ❌ Skipping `scripts/check-cdc-submodule.sh` because “the Core PR is about to merge”.

## Related

- Packwiz jar / toml details: `.agents/skills/packwiz-assets/SKILL.md`
- After pull/rebase that moves the gitlink: `.agents/skills/repo-sync/SKILL.md`
- CDC freeze vs HotAI on release lines: `docs/dev-knowledge/branch-and-release.md`
- Shared check used by agents and CI: `scripts/check-cdc-submodule.sh`
