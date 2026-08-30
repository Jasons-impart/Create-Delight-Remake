#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None


def q(value):
    return json.dumps(str(value), ensure_ascii=False)


def read_source(path):
    if tomllib is not None:
        with path.open("rb") as f:
            data = tomllib.load(f)
    else:
        data = {}
        section = data
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.split("#", 1)[0].strip()
            if not line:
                continue
            if line.startswith("[") and line.endswith("]"):
                section_name = line[1:-1].strip()
                section = data.setdefault(section_name, {})
                continue
            if "=" not in line:
                raise SystemExit(f"Cannot parse line in {path}: {raw_line}")
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            if value.startswith('"') and value.endswith('"'):
                value = json.loads(value)
            section[key] = value

    required_top = ("name", "author", "version", "pack-format")
    versions = data.get("versions")
    missing = [key for key in required_top if key not in data]
    if not isinstance(versions, dict):
        missing.append("versions")
        versions = {}
    for key in ("forge", "minecraft"):
        if key not in versions:
            missing.append(f"versions.{key}")
    if missing:
        raise SystemExit(f"{path} is missing required field(s): {', '.join(missing)}")

    return data


def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def write_utf8(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def main():
    repo_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(
        description="Generate packwiz pack.toml/index.toml from modpack.toml."
    )
    parser.add_argument(
        "--source",
        default=str(repo_root / "modpack.toml"),
        help="Path to the tracked modpack metadata source.",
    )
    parser.add_argument(
        "--output-dir",
        default=str(repo_root),
        help="Directory where pack.toml and index.toml should be written.",
    )
    args = parser.parse_args()

    source = Path(args.source).resolve()
    output_dir = Path(args.output_dir).resolve()
    data = read_source(source)

    index_path = output_dir / "index.toml"
    if not index_path.exists():
        write_utf8(index_path, 'hash-format = "sha256"\n')

    index_hash = sha256(index_path)
    versions = data["versions"]
    pack_toml = (
        f"name = {q(data['name'])}\n"
        f"author = {q(data['author'])}\n"
        f"version = {q(data['version'])}\n"
        f"pack-format = {q(data['pack-format'])}\n"
        "\n"
        "[index]\n"
        'file = "index.toml"\n'
        'hash-format = "sha256"\n'
        f"hash = {q(index_hash)}\n"
        "\n"
        "[versions]\n"
        f"forge = {q(versions['forge'])}\n"
        f"minecraft = {q(versions['minecraft'])}\n"
    )
    write_utf8(output_dir / "pack.toml", pack_toml)


if __name__ == "__main__":
    main()
