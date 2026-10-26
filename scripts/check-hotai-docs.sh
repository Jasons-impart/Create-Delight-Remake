#!/usr/bin/env bash
# When hotai/ patch files change (add/delete/modify), require a matching change
# under docs/dev-knowledge/hotai/ in the same commit range.
# Used by CI (.github/workflows/validate-hotai-docs.yml).
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "error: not inside a git worktree" >&2
  exit 1
fi
cd "${REPO_ROOT}"

HOTAI_CODE_PREFIX="hotai/"
HOTAI_DOCS_PREFIX="docs/dev-knowledge/hotai/"

HEAD_REF="${HOTAI_DOCS_HEAD:-HEAD}"
BASE_REF="${HOTAI_DOCS_BASE:-}"

if [[ -z "${BASE_REF}" ]]; then
  if [[ -n "${GITHUB_BASE_REF:-}" ]]; then
    # Local/CI fallback when only the branch name is available.
    BASE_REF="origin/${GITHUB_BASE_REF}"
  elif git rev-parse --verify --quiet origin/main >/dev/null; then
    BASE_REF="origin/main"
  else
    echo "error: set HOTAI_DOCS_BASE to the comparison base SHA/ref" >&2
    exit 1
  fi
fi

if ! git rev-parse --verify --quiet "${BASE_REF}^{commit}" >/dev/null; then
  echo "error: cannot resolve base ref: ${BASE_REF}" >&2
  exit 1
fi
if ! git rev-parse --verify --quiet "${HEAD_REF}^{commit}" >/dev/null; then
  echo "error: cannot resolve head ref: ${HEAD_REF}" >&2
  exit 1
fi

BASE_SHA="$(git rev-parse "${BASE_REF}^{commit}")"
HEAD_SHA="$(git rev-parse "${HEAD_REF}^{commit}")"

# Triple-dot: changes on HEAD since merge-base with BASE (PR-shaped diff).
mapfile -t CHANGED_FILES < <(git diff --name-only --diff-filter=ACDMRT "${BASE_SHA}...${HEAD_SHA}")

hotai_code_changes=()
hotai_docs_changes=()

for path in "${CHANGED_FILES[@]:-}"; do
  [[ -z "${path}" ]] && continue
  case "${path}" in
    "${HOTAI_CODE_PREFIX}"*)
      hotai_code_changes+=("${path}")
      ;;
    "${HOTAI_DOCS_PREFIX}"*)
      hotai_docs_changes+=("${path}")
      ;;
  esac
done

if [[ ${#hotai_code_changes[@]} -eq 0 ]]; then
  echo "OK: no ${HOTAI_CODE_PREFIX} file changes between ${BASE_SHA:0:12}...${HEAD_SHA:0:12}; HotAI docs check skipped."
  exit 0
fi

if [[ ${#hotai_docs_changes[@]} -gt 0 ]]; then
  echo "OK: ${#hotai_code_changes[@]} HotAI file change(s) and ${#hotai_docs_changes[@]} HotAI doc change(s) in ${BASE_SHA:0:12}...${HEAD_SHA:0:12}."
  printf '  code: %s\n' "${hotai_code_changes[@]}"
  printf '  docs: %s\n' "${hotai_docs_changes[@]}"
  exit 0
fi

cat >&2 <<MSG
error: HotAI 文件有变更，但同范围未更新 HotAI 文档 / HotAI files changed without HotAI docs updates.

Changed under ${HOTAI_CODE_PREFIX} (${BASE_SHA:0:12}...${HEAD_SHA:0:12}):
$(printf '  - %s\n' "${hotai_code_changes[@]}")

请同步更新文档目录 ${HOTAI_DOCS_PREFIX}（例如 patch-map.md / badiff-details.md，并按需运行 scripts/update-hotai-docs.ps1）。
Please update files under ${HOTAI_DOCS_PREFIX} in the same PR (e.g. patch-map.md / badiff-details.md; run scripts/update-hotai-docs.ps1 when appropriate).

See .agents/skills/hotai/SKILL.md and docs/dev-knowledge/hotai/README.md.
MSG
exit 1
