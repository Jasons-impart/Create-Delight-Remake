#!/usr/bin/env bash
# Verify CDC-mod-src gitlink is an ancestor of Create-Delight-Core origin/1.20.1.
# Used by agents (cdc-bump skill) and CI (.github/workflows/validate-cdc-submodule.yml).
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "error: not inside a git worktree" >&2
  exit 1
fi
cd "${REPO_ROOT}"

SUBMODULE_PATH="CDC-mod-src"
GITMODULES=".gitmodules"

if [[ ! -f "${GITMODULES}" ]]; then
  echo "error: ${GITMODULES} missing" >&2
  exit 1
fi

CDC_URL="$(git config -f "${GITMODULES}" --get submodule.${SUBMODULE_PATH}.url || true)"
if [[ -z "${CDC_URL}" ]]; then
  echo "error: submodule ${SUBMODULE_PATH} url not found in ${GITMODULES}" >&2
  exit 1
fi

if ! GITLINK_SHA="$(git rev-parse "HEAD:${SUBMODULE_PATH}" 2>/dev/null)"; then
  echo "error: cannot read gitlink for ${SUBMODULE_PATH} at HEAD" >&2
  exit 1
fi

if [[ ! "${GITLINK_SHA}" =~ ^[0-9a-f]{40}$ ]]; then
  echo "error: unexpected gitlink value for ${SUBMODULE_PATH}: ${GITLINK_SHA}" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/check-cdc-submodule.XXXXXX")"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

# Commit-graph only: enough for merge-base --is-ancestor without full trees/blobs.
git -C "${TMP_DIR}" init --quiet
git -C "${TMP_DIR}" remote add origin "${CDC_URL}"
if ! git -C "${TMP_DIR}" fetch --quiet --filter=blob:none origin \
  "${GITLINK_SHA}" \
  "+refs/heads/1.20.1:refs/remotes/origin/1.20.1"; then
  echo "error: failed to fetch Create-Delight-Core ${GITLINK_SHA} and branch 1.20.1 from ${CDC_URL}" >&2
  echo "hint: check network access and that the gitlink commit still exists on Core." >&2
  exit 1
fi

if ! git -C "${TMP_DIR}" cat-file -e "${GITLINK_SHA}^{commit}" 2>/dev/null; then
  echo "error: gitlink ${GITLINK_SHA} is not a commit in ${CDC_URL}" >&2
  exit 1
fi

if ! git -C "${TMP_DIR}" rev-parse --verify --quiet refs/remotes/origin/1.20.1 >/dev/null; then
  echo "error: origin/1.20.1 missing after fetch from ${CDC_URL}" >&2
  exit 1
fi

BRANCH_TIP="$(git -C "${TMP_DIR}" rev-parse refs/remotes/origin/1.20.1)"

if git -C "${TMP_DIR}" merge-base --is-ancestor "${GITLINK_SHA}" refs/remotes/origin/1.20.1; then
  echo "OK: CDC-mod-src@${GITLINK_SHA:0:12} is an ancestor of Create-Delight-Core origin/1.20.1 (${BRANCH_TIP:0:12})."
  exit 0
fi

cat >&2 <<MSG
error: CDC-mod-src gitlink ${GITLINK_SHA} is NOT an ancestor of Create-Delight-Core origin/1.20.1 (${BRANCH_TIP}).

Do not pin a mergeable Remake PR to an unmerged Core feature-branch tip.
1. Squash-merge the Create-Delight-Core PR into 1.20.1.
2. Re-fetch Core and pin CDC-mod-src to the post-merge SHA on origin/1.20.1
   (squash changes the SHA; the pre-merge tip is wrong).
3. Update packwiz-files/mods/Create-Delight-Core-1.20.1-dev.jar and
   mods/create-delight-core.pw.toml in the same Remake commit.
4. Re-run: scripts/check-cdc-submodule.sh

See .agents/skills/cdc-bump/SKILL.md.
MSG
exit 1
