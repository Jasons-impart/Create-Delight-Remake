#!/usr/bin/env python3
"""Convert connected textures between Create OMNIDIRECTIONAL and LDLib CTM.

Create stores complete face variants in an 8x8 sheet. LDLib stores half-sized
face quadrants in a compact 4x4 sheet. This tool converts in either direction,
validates Create's 47 reachable neighbour states, and can add the required
``ldlib.connection`` texture metadata to the target base texture.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
from dataclasses import dataclass
from itertools import product
from pathlib import Path
from typing import Iterable

try:
    from PIL import Image, ImageChops
except ImportError as exc:  # pragma: no cover - depends on the local Python install
    raise SystemExit(
        "缺少 Pillow。请先执行 `python -m pip install Pillow`，再运行本脚本。"
    ) from exc


CONTEXT_FIELDS = (
    "up",
    "down",
    "left",
    "right",
    "top_left",
    "top_right",
    "bottom_left",
    "bottom_right",
)

RESOURCE_LOCATION_RE = re.compile(r"^[a-z0-9_.-]+:[a-z0-9/._-]+$")


class ConversionError(RuntimeError):
    """Raised for invalid input or unsafe output operations."""


@dataclass(frozen=True)
class Quadrant:
    name: str
    first_side: str
    second_side: str
    diagonal: str
    ldlib_offset: int
    column: int
    row: int


# The order and offsets come from LDLib 1.20.1-1.0.50 Connections.
# Quadrant order: bottom-left, bottom-right, top-right, top-left.
QUADRANTS = (
    Quadrant("bottom-left", "down", "left", "bottom_left", 4, 0, 1),
    Quadrant("bottom-right", "down", "right", "bottom_right", 5, 1, 1),
    Quadrant("top-right", "up", "right", "top_right", 1, 1, 0),
    Quadrant("top-left", "up", "left", "top_left", 0, 0, 0),
)


@dataclass(frozen=True)
class ValidationReport:
    tested_contexts: int
    mismatched_contexts: int
    mismatched_tiles: tuple[int, ...]
    mismatched_pixels: int

    @property
    def lossless(self) -> bool:
        return self.mismatched_contexts == 0


def normalize_context(context: dict[str, bool]) -> dict[str, bool]:
    """Fold raw masks into Create's 47 reachable, LDLib-equivalent states.

    Create only exposes a diagonal connection when both adjacent edges connect.
    LDLib samples all eight neighbours independently, but its quadrant selection
    ignores an orphan diagonal unless those two edges also connect. Folding the
    orphan bits is therefore output-equivalent for both renderers.
    """

    normalized = dict(context)
    normalized["top_left"] = bool(
        normalized["top_left"] and normalized["up"] and normalized["left"]
    )
    normalized["top_right"] = bool(
        normalized["top_right"] and normalized["up"] and normalized["right"]
    )
    normalized["bottom_left"] = bool(
        normalized["bottom_left"] and normalized["down"] and normalized["left"]
    )
    normalized["bottom_right"] = bool(
        normalized["bottom_right"] and normalized["down"] and normalized["right"]
    )
    return normalized


def create_omnidirectional_index(context: dict[str, bool]) -> int:
    """Mirror Create 6.0.8 AllCTTypes.OMNIDIRECTIONAL#getTextureIndex."""

    context = normalize_context(context)
    tile_x = 0
    tile_y = 0
    borders = sum(not context[side] for side in ("up", "down", "left", "right"))

    if context["up"]:
        tile_x += 1
    if context["down"]:
        tile_x += 2
    if context["left"]:
        tile_y += 1
    if context["right"]:
        tile_y += 2

    if borders == 0:
        if context["top_right"]:
            tile_x += 1
        if context["top_left"]:
            tile_x += 2
        if context["bottom_right"]:
            tile_y += 2
        if context["bottom_left"]:
            tile_y += 1

    if borders == 1:
        if not context["right"] and (context["top_left"] or context["bottom_left"]):
            tile_y = 4
            tile_x = -1 + int(context["bottom_left"]) + 2 * int(context["top_left"])
        if not context["left"] and (context["top_right"] or context["bottom_right"]):
            tile_y = 5
            tile_x = -1 + int(context["bottom_right"]) + 2 * int(context["top_right"])
        if not context["down"] and (context["top_left"] or context["top_right"]):
            tile_y = 6
            tile_x = -1 + int(context["top_left"]) + 2 * int(context["top_right"])
        if not context["up"] and (context["bottom_left"] or context["bottom_right"]):
            tile_y = 7
            tile_x = -1 + int(context["bottom_left"]) + 2 * int(context["bottom_right"])

    if borders == 2:
        connected_corner = (
            (context["up"] and context["left"] and context["top_left"])
            or (context["down"] and context["left"] and context["bottom_left"])
            or (context["up"] and context["right"] and context["top_right"])
            or (context["down"] and context["right"] and context["bottom_right"])
        )
        if connected_corner:
            tile_x += 3

    return tile_x + 8 * tile_y


def iter_contexts() -> Iterable[dict[str, bool]]:
    seen: set[tuple[bool, ...]] = set()
    for values in product((False, True), repeat=len(CONTEXT_FIELDS)):
        context = normalize_context(dict(zip(CONTEXT_FIELDS, values)))
        key = tuple(context[field] for field in CONTEXT_FIELDS)
        if key in seen:
            continue
        seen.add(key)
        yield context


def crop_create_tile(sheet: Image.Image, tile_size: int, index: int) -> Image.Image:
    tile_x = index % 8
    tile_y = index // 8
    left = tile_x * tile_size
    top = tile_y * tile_size
    return sheet.crop((left, top, left + tile_size, top + tile_size))


def quadrant_box(quadrant: Quadrant, half_tile: int) -> tuple[int, int, int, int]:
    left = quadrant.column * half_tile
    top = quadrant.row * half_tile
    return left, top, left + half_tile, top + half_tile


def build_ldlib_sheet(create_sheet: Image.Image, tile_size: int) -> Image.Image:
    half_tile = tile_size // 2
    output = Image.new("RGBA", (tile_size * 2, tile_size * 2))

    # LDLib places each quadrant's four useful variants at offset,
    # offset+2, offset+8 and offset+10 in its 4x4 half-tile atlas.
    variants = (
        ((True, True, True), 0),
        ((True, False, False), 2),
        ((False, True, False), 8),
        ((True, True, False), 10),
    )

    for quadrant in QUADRANTS:
        source_box = quadrant_box(quadrant, half_tile)
        for (first, second, diagonal), delta in variants:
            context = dict.fromkeys(CONTEXT_FIELDS, False)
            context[quadrant.first_side] = first
            context[quadrant.second_side] = second
            context[quadrant.diagonal] = diagonal

            create_index = create_omnidirectional_index(context)
            create_tile = crop_create_tile(create_sheet, tile_size, create_index)
            sub_tile = create_tile.crop(source_box)

            ldlib_index = quadrant.ldlib_offset + delta
            target_x = (ldlib_index % 4) * half_tile
            target_y = (ldlib_index // 4) * half_tile
            output.paste(sub_tile, (target_x, target_y))

    return output


def build_create_sheet(
    base_texture: Image.Image,
    ldlib_sheet: Image.Image,
    tile_size: int,
) -> Image.Image:
    """Expand an LDLib compact atlas into Create's 47 full-face states."""

    output = Image.new("RGBA", (tile_size * 8, tile_size * 8), (0, 0, 0, 0))
    rendered_tiles: dict[int, Image.Image] = {}

    for context in iter_contexts():
        create_index = create_omnidirectional_index(context)
        tile = render_ldlib_state(base_texture, ldlib_sheet, tile_size, context)
        existing = rendered_tiles.get(create_index)
        if existing is not None:
            if count_different_pixels(existing, tile):
                raise ConversionError(
                    "同一个 Create 状态索引对应了多个不同的 LDLib 结果；"
                    f"无法无损展开，冲突索引为 {create_index}。"
                )
            continue

        rendered_tiles[create_index] = tile
        target_x = (create_index % 8) * tile_size
        target_y = (create_index // 8) * tile_size
        output.paste(tile, (target_x, target_y))

    if len(rendered_tiles) != 47:
        raise ConversionError(
            f"内部状态表异常：应生成 47 个 Create 状态，实际为 {len(rendered_tiles)}。"
        )

    return output


def render_ldlib_state(
    base_texture: Image.Image,
    ldlib_sheet: Image.Image,
    tile_size: int,
    context: dict[str, bool],
) -> Image.Image:
    context = normalize_context(context)
    half_tile = tile_size // 2
    output = Image.new("RGBA", (tile_size, tile_size))

    for quadrant in QUADRANTS:
        face_box = quadrant_box(quadrant, half_tile)
        first = context[quadrant.first_side]
        second = context[quadrant.second_side]
        diagonal = context[quadrant.diagonal]

        if not first and not second:
            sub_tile = base_texture.crop(face_box)
        else:
            if first and second and diagonal:
                ldlib_index = quadrant.ldlib_offset
            else:
                ldlib_index = quadrant.ldlib_offset
                if first:
                    ldlib_index += 2
                if second:
                    ldlib_index += 8

            source_x = (ldlib_index % 4) * half_tile
            source_y = (ldlib_index // 4) * half_tile
            sub_tile = ldlib_sheet.crop(
                (source_x, source_y, source_x + half_tile, source_y + half_tile)
            )

        output.paste(sub_tile, (face_box[0], face_box[1]))

    return output


def count_different_pixels(first: Image.Image, second: Image.Image) -> int:
    difference = ImageChops.difference(first, second)
    raw = difference.tobytes()
    channels = len(difference.getbands())
    return sum(
        1
        for offset in range(0, len(raw), channels)
        if any(raw[offset : offset + channels])
    )


def validate_conversion(
    create_sheet: Image.Image,
    base_texture: Image.Image,
    ldlib_sheet: Image.Image,
    tile_size: int,
) -> ValidationReport:
    mismatched_contexts = 0
    mismatched_tiles: set[int] = set()
    mismatched_pixels = 0
    tested_contexts = 0

    for context in iter_contexts():
        tested_contexts += 1
        create_index = create_omnidirectional_index(context)
        expected = crop_create_tile(create_sheet, tile_size, create_index)
        actual = render_ldlib_state(base_texture, ldlib_sheet, tile_size, context)
        different_pixels = count_different_pixels(expected, actual)
        if different_pixels:
            mismatched_contexts += 1
            mismatched_tiles.add(create_index)
            mismatched_pixels += different_pixels

    return ValidationReport(
        tested_contexts=tested_contexts,
        mismatched_contexts=mismatched_contexts,
        mismatched_tiles=tuple(sorted(mismatched_tiles)),
        mismatched_pixels=mismatched_pixels,
    )


def load_create_sheet(path: Path) -> tuple[Image.Image, int]:
    if not path.is_file():
        raise ConversionError(f"找不到 Create 连接纹理：{path}")

    with Image.open(path) as image:
        image.load()
        sheet = image.convert("RGBA")

    width, height = sheet.size
    if width != height or width % 8 != 0:
        raise ConversionError(
            "当前仅支持单帧、正方形的 Create OMNIDIRECTIONAL 8×8 纹理表；"
            f"实际尺寸为 {width}×{height}。"
        )

    tile_size = width // 8
    if tile_size < 2 or tile_size % 2 != 0:
        raise ConversionError(
            f"单格尺寸必须是大于等于 2 的偶数，实际为 {tile_size}。"
        )

    return sheet, tile_size


def load_base_texture(path: Path, tile_size: int) -> Image.Image:
    if not path.is_file():
        raise ConversionError(f"找不到 LDLib 基础纹理：{path}")
    with Image.open(path) as image:
        image.load()
        base = image.convert("RGBA")
    if base.size != (tile_size, tile_size):
        raise ConversionError(
            f"LDLib 基础纹理应为 {tile_size}×{tile_size}，实际为 "
            f"{base.width}×{base.height}：{path}"
        )
    return base


def load_ldlib_textures(base_path: Path, ctm_path: Path) -> tuple[Image.Image, Image.Image, int]:
    if not base_path.is_file():
        raise ConversionError(f"找不到 LDLib 基础纹理：{base_path}")
    with Image.open(base_path) as image:
        image.load()
        base = image.convert("RGBA")

    if base.width != base.height or base.width < 2 or base.width % 2 != 0:
        raise ConversionError(
            "LDLib 基础纹理必须是边长大于等于 2 的偶数正方形；"
            f"实际尺寸为 {base.width}×{base.height}。"
        )

    if not ctm_path.is_file():
        raise ConversionError(f"找不到 LDLib CTM：{ctm_path}")
    with Image.open(ctm_path) as image:
        image.load()
        ctm = image.convert("RGBA")

    expected_size = base.width * 2
    if ctm.size != (expected_size, expected_size):
        raise ConversionError(
            f"LDLib CTM 应为基础纹理的 2 倍，即 {expected_size}×{expected_size}；"
            f"实际为 {ctm.width}×{ctm.height}：{ctm_path}"
        )

    return base, ctm, base.width


def images_equal(path: Path, image: Image.Image) -> bool:
    try:
        with Image.open(path) as existing:
            existing.load()
            return existing.convert("RGBA").tobytes() == image.convert("RGBA").tobytes() and (
                existing.width,
                existing.height,
            ) == image.size
    except (OSError, ValueError):
        return False


def path_key(path: Path) -> str:
    """Return a case-normalized absolute path key for collision checks."""

    return os.path.normcase(str(path.expanduser().resolve(strict=False)))


def ensure_distinct_paths(named_paths: Iterable[tuple[str, Path | None]]) -> None:
    seen: dict[str, tuple[str, Path]] = {}
    for label, path in named_paths:
        if path is None:
            continue
        key = path_key(path)
        previous = seen.get(key)
        if previous is not None:
            previous_label, previous_path = previous
            raise ConversionError(
                f"路径冲突：{label} 与 {previous_label} 指向同一文件："
                f"{path}（首次为 {previous_path}）"
            )
        seen[key] = (label, path)


def preflight_png(path: Path, image: Image.Image, force: bool) -> None:
    if path.exists() and not images_equal(path, image) and not force:
        raise ConversionError(f"输出已存在且内容不同；如需覆盖请加 --force：{path}")


def write_png(path: Path, image: Image.Image, force: bool) -> str:
    if path.exists():
        if images_equal(path, image):
            return "unchanged"
    preflight_png(path, image, force)

    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    os.close(handle)
    temporary_path = Path(temporary_name)
    try:
        image.save(temporary_path, format="PNG")
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)
    return "written"


def derive_resource_location(texture_path: Path) -> str | None:
    parts = texture_path.parts
    lowered = [part.lower() for part in parts]
    candidates = [index for index, part in enumerate(lowered) if part == "assets"]
    for assets_index in reversed(candidates):
        if assets_index + 3 >= len(parts):
            continue
        namespace = parts[assets_index + 1]
        if lowered[assets_index + 2] != "textures":
            continue
        relative = Path(*parts[assets_index + 3 :])
        if relative.suffix.lower() != ".png":
            continue
        resource_path = relative.with_suffix("").as_posix()
        location = f"{namespace}:{resource_path}"
        if RESOURCE_LOCATION_RE.fullmatch(location):
            return location
    return None


def prepare_mcmeta(
    path: Path,
    connection: str,
    emissive: bool,
) -> str | None:
    metadata: dict[str, object] = {}
    if path.exists():
        try:
            loaded = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ConversionError(f"无法读取现有 mcmeta，已停止以避免覆盖：{path}: {exc}") from exc
        if not isinstance(loaded, dict):
            raise ConversionError(f"现有 mcmeta 顶层不是 JSON object：{path}")
        metadata = loaded

    existing_ldlib = metadata.get("ldlib")
    if existing_ldlib is None:
        ldlib: dict[str, object] = {}
        metadata["ldlib"] = ldlib
    elif isinstance(existing_ldlib, dict):
        ldlib = existing_ldlib
    else:
        raise ConversionError(f"现有 mcmeta 的 ldlib 字段不是 JSON object：{path}")

    before = json.dumps(metadata, ensure_ascii=False, sort_keys=True)
    ldlib["connection"] = connection
    if emissive:
        ldlib["emissive"] = True
    after = json.dumps(metadata, ensure_ascii=False, sort_keys=True)
    if before == after and path.exists():
        return None

    return json.dumps(metadata, ensure_ascii=False, indent=2) + "\n"


def write_mcmeta(path: Path, content: str | None) -> str:
    if content is None:
        return "unchanged"

    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.", suffix=".tmp", dir=path.parent
    )
    os.close(handle)
    temporary_path = Path(temporary_name)
    try:
        temporary_path.write_text(content, encoding="utf-8", newline="\n")
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)
    return "written"


def format_report(label: str, report: ValidationReport) -> str:
    if report.lossless:
        return f"{label}：无损，可还原 Create 的全部 47 个有效状态。"
    tile_list = ", ".join(str(index) for index in report.mismatched_tiles)
    return (
        f"{label}：有损；{report.tested_contexts} 个有效邻接状态中 "
        f"{report.mismatched_contexts} 个不一致，"
        f"涉及 {len(report.mismatched_tiles)} 个 Create 格（{tile_list}），"
        f"累计不同像素 {report.mismatched_pixels}。"
    )


def add_write_options(parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
        "--check-only",
        action="store_true",
        help="只分析和验证，不写任何文件",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="允许覆盖内容不同的 PNG 输出",
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "在 Create OMNIDIRECTIONAL 的 8×8 完整状态表与 LDLib 的 "
            "4×4 半格 CTM 之间互转，并回放验证 Create 的 47 个有效邻接状态。"
        )
    )
    commands = parser.add_subparsers(dest="command", required=True)

    create_to_ldlib = commands.add_parser(
        "create-to-ldlib",
        aliases=("c2l",),
        help="把 Create 8×8 完整状态表压缩为 LDLib 4×4 半格 CTM",
    )
    create_to_ldlib.add_argument("source", type=Path, help="Create 的 *_connected.png")
    create_to_ldlib.add_argument("output", type=Path, help="要生成的 LDLib *_ctm.png")

    base_group = create_to_ldlib.add_mutually_exclusive_group()
    base_group.add_argument(
        "--base",
        type=Path,
        help="LDLib 模型实际使用的基础纹理；用于精确验证，也作为默认 mcmeta 目标",
    )
    base_group.add_argument(
        "--extract-base",
        type=Path,
        help="从 Create 表的第 0 格提取基础纹理到此路径，并以它做验证",
    )

    create_to_ldlib.add_argument(
        "--write-mcmeta",
        action="store_true",
        help="为 --base/--extract-base 写入或合并 .png.mcmeta 的 ldlib.connection",
    )
    create_to_ldlib.add_argument(
        "--connection",
        help="覆盖自动推导的连接纹理资源位置，例如 mbd2:block/steel_casing_ctm",
    )
    create_to_ldlib.add_argument(
        "--mcmeta",
        type=Path,
        help="覆盖默认的 <基础纹理>.png.mcmeta 输出路径；设置后会启用 mcmeta 写入",
    )
    create_to_ldlib.add_argument(
        "--emissive",
        action="store_true",
        help="在 ldlib 元数据中同时写入 emissive=true",
    )
    create_to_ldlib.add_argument(
        "--allow-lossy",
        action="store_true",
        help="检测到无法无损压缩时仍写出结果",
    )
    add_write_options(create_to_ldlib)

    ldlib_to_create = commands.add_parser(
        "ldlib-to-create",
        aliases=("l2c",),
        help="把 LDLib 基础纹理与 4×4 半格 CTM 展开为 Create 8×8 完整状态表",
    )
    ldlib_to_create.add_argument("base", type=Path, help="LDLib 模型使用的基础纹理")
    ldlib_to_create.add_argument("ctm", type=Path, help="LDLib 的 *_ctm.png")
    ldlib_to_create.add_argument("output", type=Path, help="要生成的 Create *_connected.png")
    add_write_options(ldlib_to_create)

    return parser


def run_create_to_ldlib(args: argparse.Namespace) -> int:
    create_sheet, tile_size = load_create_sheet(args.source)
    source_base = crop_create_tile(create_sheet, tile_size, 0)
    ldlib_sheet = build_ldlib_sheet(create_sheet, tile_size)

    if args.base:
        target_base = load_base_texture(args.base, tile_size)
        base_path = args.base
    elif args.extract_base:
        target_base = source_base
        base_path = args.extract_base
    else:
        target_base = source_base
        base_path = None

    internal_report = validate_conversion(
        create_sheet,
        source_base,
        ldlib_sheet,
        tile_size,
    )
    target_report = validate_conversion(
        create_sheet,
        target_base,
        ldlib_sheet,
        tile_size,
    )

    print(
        f"输入：{args.source} ({create_sheet.width}×{create_sheet.height}，"
        f"单格 {tile_size}×{tile_size})"
    )
    print(f"输出布局：{ldlib_sheet.width}×{ldlib_sheet.height}，4×4 个半格。")
    print(format_report("Create 表自身的紧凑性", internal_report))
    if args.base:
        print(format_report("结合指定 LDLib 基础纹理后的结果", target_report))

    report_to_enforce = target_report if args.base else internal_report
    if not report_to_enforce.lossless and not args.allow_lossy:
        print(
            "已停止写出。该贴图含有 LDLib 象限表无法表达的跨象限差异；"
            "确认接受近似结果后可加 --allow-lossy。",
            file=sys.stderr,
        )
        return 2

    wants_mcmeta = bool(args.write_mcmeta or args.connection or args.mcmeta or args.emissive)
    if wants_mcmeta and not base_path and not args.mcmeta:
        raise ConversionError(
            "写 mcmeta 时需要 --base、--extract-base，或显式指定 --mcmeta。"
        )

    connection = args.connection
    if wants_mcmeta and not connection:
        connection = derive_resource_location(args.output)
        if not connection:
            raise ConversionError(
                "无法从输出路径推导资源位置；请用 --connection 指定 namespace:path。"
            )
    if connection and not RESOURCE_LOCATION_RE.fullmatch(connection):
        raise ConversionError(
            f"无效的资源位置：{connection}；应类似 mbd2:block/steel_casing_ctm，且不带 .png。"
        )

    mcmeta_path = None
    prepared_mcmeta = None
    if wants_mcmeta:
        mcmeta_path = args.mcmeta or Path(f"{base_path}.mcmeta")

    ensure_distinct_paths(
        (
            ("Create 输入", args.source),
            ("指定基础纹理输入", args.base),
            ("LDLib CTM 输出", args.output),
            ("提取基础纹理输出", args.extract_base),
            ("mcmeta 输出", mcmeta_path),
        )
    )

    if wants_mcmeta:
        assert mcmeta_path is not None and connection is not None
        prepared_mcmeta = prepare_mcmeta(mcmeta_path, connection, args.emissive)

    if args.check_only:
        print("检查完成：--check-only 未写入文件。")
        return 0

    preflight_png(args.output, ldlib_sheet, args.force)
    if args.extract_base:
        preflight_png(args.extract_base, source_base, args.force)

    output_status = write_png(args.output, ldlib_sheet, args.force)
    print(f"LDLib CTM：{output_status} {args.output}")

    if args.extract_base:
        base_status = write_png(args.extract_base, source_base, args.force)
        print(f"基础纹理：{base_status} {args.extract_base}")

    if wants_mcmeta:
        mcmeta_status = write_mcmeta(mcmeta_path, prepared_mcmeta)
        print(f"LDLib 元数据：{mcmeta_status} {mcmeta_path}")
        print(f"connection={connection}")

    return 0


def run_ldlib_to_create(args: argparse.Namespace) -> int:
    base_texture, ldlib_sheet, tile_size = load_ldlib_textures(args.base, args.ctm)
    create_sheet = build_create_sheet(base_texture, ldlib_sheet, tile_size)
    validation = validate_conversion(
        create_sheet,
        base_texture,
        ldlib_sheet,
        tile_size,
    )
    roundtrip_ldlib = build_ldlib_sheet(create_sheet, tile_size)
    roundtrip_pixels = count_different_pixels(ldlib_sheet, roundtrip_ldlib)

    print(
        f"输入：base={args.base} ({tile_size}×{tile_size})，"
        f"ctm={args.ctm} ({ldlib_sheet.width}×{ldlib_sheet.height})"
    )
    print(
        f"输出布局：{create_sheet.width}×{create_sheet.height}，"
        "8×8 完整格，其中 47 格有效、17 格透明。"
    )
    print(format_report("LDLib 展开后的 Create 状态回放", validation))
    if roundtrip_pixels:
        raise ConversionError(
            f"内部 round-trip 失败：重新压缩后有 {roundtrip_pixels} 个 CTM 像素不同。"
        )
    print("LDLib → Create → LDLib round-trip：CTM 像素完全一致。")

    ensure_distinct_paths(
        (
            ("LDLib 基础纹理输入", args.base),
            ("LDLib CTM 输入", args.ctm),
            ("Create 连接纹理输出", args.output),
        )
    )
    if args.check_only:
        print("检查完成：--check-only 未写入文件。")
        return 0

    preflight_png(args.output, create_sheet, args.force)

    output_status = write_png(args.output, create_sheet, args.force)
    print(f"Create 连接纹理：{output_status} {args.output}")
    return 0


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        if args.command in ("create-to-ldlib", "c2l"):
            return run_create_to_ldlib(args)
        if args.command in ("ldlib-to-create", "l2c"):
            return run_ldlib_to_create(args)
        raise ConversionError(f"未知转换方向：{args.command}")
    except ConversionError as exc:
        parser.error(str(exc))
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
