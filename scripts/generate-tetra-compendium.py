#!/usr/bin/env python3
"""Generate the four read-only Tetra compendium chapters for CDRdev.

The generator deliberately uses the currently installed jars, the KubeJS data
overrides and the most recent runtime load report.  It does not treat every
JSON shipped by MMT as player-visible content: a module must have a valid
runtime definition and be reachable from a usable schematic or replacement.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
import re
import sys
import uuid
import zipfile
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable


GROUP_ID = "57E934AC8166BC73"
GENERATOR_SALT = "cdr-tetra-five-chapter-compendium-2026-08-18-v1"

JAR_NAMES = (
    "tetra-1.20.1-6.17.0.jar",
    "tetracelium-1.20.1-1.3.2.jar",
    "more_mod_tetra-2.4.15-all.jar",
    "tetrawear-1.20.1-1.0.0.jar",
)

OUTPUTS = {
    "melee": "Tetra_Weapons.snbt",
    "ranged": "Tetra_Ranged_Defense.snbt",
    "armor": "Tetra_Armor_Curios.snbt",
    "scrolls": "Tetra_Scrolls.snbt",
}

REMOVED_CHAPTERS = (
    "Tetra_Compendium.snbt",
    "Tetra_Armor.snbt",
    "Tetra_Curios.snbt",
    "Materials.snbt",
    "Forge_Heritage.snbt",
    "the_schematic.snbt",
)

FORBIDDEN_MODULE_PARTS = (
    "greatsword/more_mod_tetra/mmt_odachi",
    "/goety/",
    "goety_",
    "/malum/",
    "mmt_malum_",
    "/eidolon/",
    "mmt_eidolon_",
    "/botania/",
)

FORBIDDEN_SCROLL_PARTS = (
    "mmt_settled_scroll",
    "mmt_high_settled_scroll",
    "mmt_over_improvements",
    "mmt_skill_improvements",
    "mmt_critical_strike_improvements",
    "mmt_upgraded_netherite",
    "ode_to_cyrene",
    "ode_to_trailblaze",
    "mmt_malum",
    "mmt_eidolon",
    "mmt_botania",
)

PREFERRED_MATERIALS = {
    "metal": ("iron", "copper"),
    "rod": ("stick",),
    "wood": ("oak", "stick"),
    "stone": ("stone", "flint"),
    "gem": ("amethyst", "emerald"),
    "bone": ("bone",),
    "fibre": ("string",),
    "fabric": ("wool",),
    "skin": ("leather", "hide"),
    "scale": ("turtle_scute", "shulker_shell"),
    "dye": ("dye_white",),
    "rainbow": ("speed", "strength"),
    "white_material": ("minecraft_poison_attack", "minecraft_weakness_attack"),
    "spell_core_materials": ("iron_spell_arcane_essence",),
    "socket": ("amethyst",),
}

STAGE_SCROLL_NAMES = {
    "storm_combat": "雷鸣战技",
    "hive_guard": "蜂巢守护",
    "path_emblems": "流派徽记",
    "lunar_arcane": "月相奥术",
    "mars_guard": "重装守御",
    "magnetic_precision": "磁场精密",
    "ancient_purification": "远古净化",
    "deep_relic": "深渊遗物",
    "astral_dominion": "星界统御",
}

STAGE_SCROLL_COLORS = {
    "storm_combat": "62d9ff",
    "hive_guard": "f4bf45",
    "path_emblems": "b78cff",
    "lunar_arcane": "9aa8ff",
    "mars_guard": "c85b48",
    "magnetic_precision": "e64f9b",
    "ancient_purification": "78b35a",
    "deep_relic": "315d83",
    "astral_dominion": "d08cff",
}

ITEM_LABELS = {
    "sword": "模块化剑",
    "single": "单头工具",
    "double": "双头工具",
    "mmt_iron_staff": "模块化法杖",
    "modular_dark_wand": "暗魔杖",
    "bow": "Tetra 模块化弓",
    "modular_mmt_bow": "MMT 模块化弓",
    "crossbow": "模块化弩",
    "shield": "模块化盾牌",
    "toolbelt": "工具腰带",
    "armor/helmet": "头部护甲",
    "armor/chest": "胸部护甲",
    "armor/leggings": "腿部护甲",
    "armor/boots": "足部护甲",
    "mmt_ring": "戒指",
    "mmt_bracelet": "手镯",
    "mmt_necklace": "项链",
    "mmt_glove": "手套",
    "mmt_shoes": "鞋",
    "mmt_heart_protecting_mirror": "护心镜",
    "mmt_emblem": "徽章",
    "mmt_crown": "王冠",
    "mmt_totem_of_undying": "不死图腾",
    "mmt_amulet": "护符",
    "mmt_white_container": "纯白容器",
    "mmt_white_scabbard": "纯白剑鞘",
    "mmt_white_quiver": "纯白箭袋",
    "mmt_white_bag": "纯白书袋",
}

ITEM_IDS = {
    "sword": "tetra:modular_sword",
    "single": "tetra:modular_single",
    "double": "tetra:modular_double",
    "mmt_iron_staff": "more_mod_tetra:modular_mmt_iron_staff",
    "modular_dark_wand": "more_mod_tetra:modular_dark_wand",
    "bow": "tetra:modular_bow",
    "modular_mmt_bow": "more_mod_tetra:modular_mmt_bow",
    "crossbow": "tetra:modular_crossbow",
    "shield": "tetra:modular_shield",
    "toolbelt": "tetra:modular_toolbelt",
    "armor/helmet": "tetrawear:modular_helmet",
    "armor/chest": "tetrawear:modular_chest",
    "armor/leggings": "tetrawear:modular_leggings",
    "armor/boots": "tetrawear:modular_boots",
    "mmt_ring": "more_mod_tetra:modular_mmt_ring",
    "mmt_bracelet": "more_mod_tetra:modular_mmt_bracelet",
    "mmt_necklace": "more_mod_tetra:modular_mmt_necklace",
    "mmt_glove": "more_mod_tetra:modular_mmt_glove",
    "mmt_shoes": "more_mod_tetra:modular_mmt_shoes",
    "mmt_heart_protecting_mirror": "more_mod_tetra:modular_mmt_heart_protecting_mirror",
    "mmt_emblem": "more_mod_tetra:modular_mmt_emblem",
    "mmt_crown": "more_mod_tetra:modular_mmt_crown",
    "mmt_totem_of_undying": "more_mod_tetra:modular_mmt_totem_of_undying",
    "mmt_amulet": "more_mod_tetra:modular_mmt_amulet",
    "mmt_white_container": "more_mod_tetra:modular_mmt_white_container",
    "mmt_white_scabbard": "more_mod_tetra:modular_mmt_white_scabbard",
    "mmt_white_quiver": "more_mod_tetra:modular_mmt_white_quiver",
    "mmt_white_bag": "more_mod_tetra:modular_mmt_white_bag",
}

MELEE_ITEMS = ("sword", "single", "double", "mmt_iron_staff", "modular_dark_wand")
RANGED_ITEMS = ("bow", "modular_mmt_bow", "crossbow", "shield", "toolbelt")
ARMOR_ITEMS = (
    "armor/helmet",
    "armor/chest",
    "armor/leggings",
    "armor/boots",
)
CURIO_ITEMS = (
    "mmt_ring",
    "mmt_bracelet",
    "mmt_necklace",
    "mmt_glove",
    "mmt_shoes",
    "mmt_heart_protecting_mirror",
    "mmt_emblem",
    "mmt_crown",
    "mmt_totem_of_undying",
    "mmt_amulet",
    "mmt_white_container",
    "mmt_white_scabbard",
    "mmt_white_quiver",
    "mmt_white_bag",
)

BASE_FALLBACKS = {
    "tetra:modular_sword": {
        "sword/blade": ("sword/basic_blade", "basic_blade/iron"),
        "sword/hilt": ("sword/basic_hilt", "basic_hilt/stick"),
        "sword/guard": ("sword/makeshift_guard", "makeshift_guard/iron"),
        "sword/pommel": ("sword/decorative_pommel", "decorative_pommel/iron"),
    },
    "tetra:modular_single": {
        "single/head": ("single/basic_shovel", "basic_shovel/iron"),
        "single/handle": ("single/basic_handle", "basic_handle/stick"),
    },
    "tetra:modular_double": {
        "double/head_left": ("double/basic_hammer_left", "basic_hammer/iron"),
        "double/head_right": ("double/basic_hammer_right", "basic_hammer/iron"),
        "double/handle": ("double/basic_handle", "basic_handle/stick"),
    },
    "tetra:modular_bow": {
        "bow/stave": ("bow/straight_stave", "straight_stave/oak"),
        "bow/string": ("bow/basic_string", "basic_string/string"),
    },
    "more_mod_tetra:modular_mmt_bow": {
        "modular_mmt_bow/stave": ("modular_mmt_bow/straight_stave", "straight_stave/oak"),
        "modular_mmt_bow/string": ("modular_mmt_bow/basic_string", "basic_string/string"),
    },
    "tetra:modular_crossbow": {
        "crossbow/stave": ("crossbow/basic_stave", "basic_stave/oak"),
        "crossbow/string": ("crossbow/basic_string", "basic_string/string"),
        "crossbow/stock": ("crossbow/basic_stock", "basic_stock/oak"),
    },
    "tetra:modular_shield": {
        "shield/plate": ("shield/heater", "heater/iron"),
        "shield/grip": ("shield/basic_grip", "basic_grip/stick"),
        "shield/boss": ("shield/sturdy_boss", "sturdy_boss/iron"),
    },
    "tetra:modular_toolbelt": {
        "toolbelt/belt": ("toolbelt/belt", "belt/leather"),
        "toolbelt/strap": ("toolbelt/strap", "strap/leather"),
    },
}

SLOT_LABEL_EXACT = {
    "sword/blade": "剑刃",
    "sword/hilt": "剑柄",
    "sword/guard": "护手",
    "sword/pommel": "配重与剑首",
    "sword/fuller": "附层与血槽",
    "single/head": "工具头",
    "single/handle": "手柄",
    "single/binding": "绑定",
    "double/head": "工具头",
    "double/handle": "手柄",
    "double/binding": "绑定",
    "double/butt": "尾部",
    "bow/stave": "弓臂",
    "bow/string": "弓弦",
    "bow/riser": "弓把",
    "modular_mmt_bow/stave": "弓臂",
    "modular_mmt_bow/string": "弓弦",
    "modular_mmt_bow/riser": "弓把",
    "crossbow/stave": "弩臂",
    "crossbow/string": "弩弦",
    "crossbow/stock": "枪托",
    "shield/plate": "盾面",
    "shield/grip": "握把",
    "shield/straps": "绑带",
    "shield/spike": "盾刺",
    "shield/boss": "盾心",
}

HAMMER_MATERIALS = (
    ("龙炎钢锤头", "iceandfire_fire_dragonsteel", "&e用途：提供七级锻造能力。"),
    ("终结龙锤头", "end_dragon_ingot", "&e用途：提供八级锻造能力。"),
    ("悚怖钢锤头", "dreadsteel_ingot", "&e用途：提供八级锻造能力。"),
)

TWIN_STAGES = (
    ("星爆气流斩", "&e用途：开启双剑的连续攻击强化。"),
    ("日蚀", "&e用途：继续提高双剑剑技熟练度。"),
    ("日蚀星爆气流斩", "&e用途：进入双剑终式强化阶段。"),
    ("完美阶段", "&e用途：完成双剑专属剑技的最终打磨。"),
)

WARFORGE_TO_MODULE = {
    "warforge/axe": "double/basic_axe",
    "warforge/hammer": "double/basic_hammer",
    "warforge/pickaxe": "double/basic_pickaxe",
    "warforge/butt": "double/butt",
    "warforge/claw": "double/claw",
    "warforge/hoe": "double/hoe",
    "warforge/sickle": "double/sickle",
    "warforge/adze": "double/adze",
}

TITAN_GROUPS = {
    "命运": ("passage", "law", "time"),
    "基石": ("sky", "earth", "ocean"),
    "创世": ("romance", "worldbearing", "reason"),
    "灾祸": ("trickery", "strife", "death"),
}

BASE_TETRA_SCROLLS = {
    "hammer_efficiency": (0, "2bffee", [3, 8, 1, 4]),
    "axe_efficiency": (0, "2bffee", [3, 8, 1, 4]),
    "cut_efficiency": (0, "2bffee", [3, 8, 1, 4]),
    "gem_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "metal_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "wood_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "stone_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "fibre_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "skin_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "bone_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "fabric_expertise": (0, "ff6666", [3, 8, 1, 4]),
    "scale_expertise": (0, "ff6666", [3, 8, 1, 4]),
}


def stable_id(seed: str) -> str:
    digest = hashlib.sha256(f"{GENERATOR_SALT}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest[:8], "big") & 0x7FFFFFFFFFFFFFFF
    return f"{max(value, 1):016X}"


def stable_uuid(seed: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"{GENERATOR_SALT}:{seed}"))


def quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def indent(lines: Iterable[str], level: int = 1) -> list[str]:
    prefix = "\t" * level
    return [prefix + line if line else line for line in lines]


def iter_dicts(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from iter_dicts(child)
    elif isinstance(value, list):
        for child in value:
            yield from iter_dicts(child)


def installed_mod_ids(mods_dir: Path) -> set[str]:
    result = {"minecraft", "forge", "tetra", "more_mod_tetra", "tetrawear", "tetracelium", "createdelight"}
    section_pattern = re.compile(r"^\s*\[\[([^]]+)\]\]")
    mod_pattern = re.compile(r"^\s*modId\s*=\s*[\"']([^\"']+)[\"']")
    for jar in mods_dir.glob("*.jar"):
        try:
            with zipfile.ZipFile(jar) as archive:
                for name in ("META-INF/mods.toml", "META-INF/neoforge.mods.toml"):
                    if name in archive.namelist():
                        text = archive.read(name).decode("utf-8", errors="replace")
                        section = ""
                        for line in text.splitlines():
                            section_match = section_pattern.match(line)
                            if section_match:
                                section = section_match.group(1).strip().strip("\"'")
                            mod_match = mod_pattern.match(line)
                            if mod_match and section == "mods":
                                result.add(mod_match.group(1))
        except (OSError, zipfile.BadZipFile):
            continue
    return result


def conditions_allow(value: Any, mod_ids: set[str]) -> bool:
    if not isinstance(value, dict):
        return True
    conditions = value.get("conditions")
    if not isinstance(conditions, list):
        return True
    for condition in conditions:
        if not isinstance(condition, dict):
            continue
        kind = str(condition.get("type", ""))
        if kind == "forge:false":
            return False
        if kind == "forge:mod_loaded" and condition.get("modid") not in mod_ids:
            return False
        if kind == "forge:not" and conditions_allow({"conditions": [condition.get("value", {})]}, mod_ids):
            return False
        if kind == "forge:and":
            children = condition.get("values", [])
            if any(not conditions_allow({"conditions": [child]}, mod_ids) for child in children):
                return False
        if kind == "forge:or":
            children = condition.get("values", [])
            if children and not any(conditions_allow({"conditions": [child]}, mod_ids) for child in children):
                return False
    return True


def ingredient_namespaces(value: Any) -> set[str]:
    found: set[str] = set()
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"item", "tag"} and isinstance(child, str) and ":" in child:
                found.add(child.split(":", 1)[0])
            else:
                found.update(ingredient_namespaces(child))
    elif isinstance(value, list):
        for child in value:
            found.update(ingredient_namespaces(child))
    return found


def ingredients_available(document: dict[str, Any], mod_ids: set[str]) -> bool:
    subset = {
        key: document[key]
        for key in ("ingredient", "ingredients", "key")
        if key in document
    }
    namespaces = ingredient_namespaces(subset)
    ignored = {"minecraft", "forge", "c", "tetra", "createdelight", "more_mod_tetra", "tetrawear"}
    return all(namespace in mod_ids or namespace in ignored for namespace in namespaces)


@dataclass
class ResourceLayer:
    name: str
    json_documents: dict[str, Any] = field(default_factory=dict)
    lang: dict[str, str] = field(default_factory=dict)


def load_jar_layer(path: Path) -> ResourceLayer:
    layer = ResourceLayer(path.name)
    with zipfile.ZipFile(path) as archive:
        for name in archive.namelist():
            if not name.endswith(".json"):
                continue
            try:
                document = json.loads(archive.read(name).decode("utf-8-sig"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                continue
            normalized = name.replace("\\", "/")
            if normalized.startswith("data/"):
                layer.json_documents[normalized] = document
            if re.fullmatch(r"assets/[^/]+/lang/zh_cn\.json", normalized) and isinstance(document, dict):
                layer.lang.update({str(k): str(v) for k, v in document.items()})
    return layer


def load_kubejs_layer(root: Path) -> ResourceLayer:
    layer = ResourceLayer("kubejs")
    data_root = root / "kubejs" / "data"
    for path in data_root.rglob("*.json"):
        try:
            document = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, json.JSONDecodeError):
            continue
        rel = path.relative_to(root / "kubejs").as_posix()
        layer.json_documents[rel] = document
    assets_root = root / "kubejs" / "assets"
    for path in assets_root.glob("*/lang/zh_cn.json"):
        try:
            document = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, json.JSONDecodeError):
            continue
        if isinstance(document, dict):
            layer.lang.update({str(k): str(v) for k, v in document.items()})
    return layer


def load_failed_runtime_entries(log_path: Path) -> tuple[set[str], set[str]]:
    failed_modules: set[str] = set()
    failed_schematics: set[str] = set()
    if not log_path.exists():
        return failed_modules, failed_schematics
    text = log_path.read_text(encoding="utf-8", errors="replace")
    failed_modules.update(re.findall(r"Failed to create module from module data 'tetra:([^']+)'", text))
    failed_schematics.update(re.findall(r"Failed to create schematic from schematic definition 'tetra:([^']+)'", text))
    return failed_modules, failed_schematics


def strip_formatting(text: str) -> str:
    text = re.sub(r"§[0-9A-FK-ORa-fk-or]", "", text)
    text = re.sub(r"&[0-9A-FK-ORa-fk-or]", "", text)
    return " ".join(text.replace("\n", " ").split())


def compact_sentence(text: str, limit: int = 46) -> str:
    text = strip_formatting(text)
    first = re.split(r"[。！？；]", text, maxsplit=1)[0].strip(" ，,.;；")
    if not first:
        return "改变这一槽位的功能定位"
    if len(first) > limit:
        first = first[: limit - 1].rstrip("，,") + "…"
    return first


def scroll_tooltip_lines(text: str, limit: int = 36) -> list[str]:
    """Preserve a scroll tooltip description while splitting it for FTB Quests."""
    text = re.sub(r"§([0-9A-FK-ORa-fk-or])", r"&\1", text.replace("\r", ""))
    result: list[str] = []
    active_color = "&7"

    def visible_length(value: str) -> int:
        return len(re.sub(r"&[0-9A-FK-ORa-fk-or]", "", value))

    def append_chunk(value: str) -> None:
        nonlocal active_color
        value = value.strip()
        if not value:
            return
        if not re.match(r"&[0-9A-FK-ORa-fk-or]", value):
            value = active_color + value
        result.append(value)
        for code in re.findall(r"&[0-9A-FK-ORa-fk-or]", value):
            if code[1].lower() in "0123456789abcdef":
                active_color = code
            elif code[1].lower() == "r":
                active_color = "&7"

    for paragraph in text.split("\n"):
        paragraph = " ".join(paragraph.split())
        if not paragraph:
            continue
        sentences = re.findall(r".+?(?:[。！？；]|$)", paragraph)
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            if visible_length(sentence) <= limit:
                append_chunk(sentence)
                continue
            pieces = re.findall(r".+?(?:[，,：:；;]|$)", sentence)
            current = ""
            for piece in pieces:
                piece = piece.strip()
                if not piece:
                    continue
                candidate = current + piece
                if current and visible_length(candidate) > limit:
                    append_chunk(current)
                    current = piece
                else:
                    current = candidate
            append_chunk(current)
    return result


def module_item_key(module_key: str) -> str | None:
    if module_key.startswith("armor/helmet/"):
        return "armor/helmet"
    if module_key.startswith("armor/chest/"):
        return "armor/chest"
    if module_key.startswith("armor/leggings/"):
        return "armor/leggings"
    if module_key.startswith("armor/boots/"):
        return "armor/boots"
    first = module_key.split("/", 1)[0]
    if first in set(MELEE_ITEMS + RANGED_ITEMS + CURIO_ITEMS):
        return first
    return None


def normalized_slot(module_key: str, slots: list[str]) -> str:
    slot = slots[0] if slots else module_key.rsplit("/", 1)[0]
    if module_key.startswith(("mmt_white_container/", "mmt_white_scabbard/", "mmt_white_quiver/", "mmt_white_bag/")):
        color = slot.rsplit("/", 1)[-1]
        if color != "white":
            return slot.rsplit("/", 1)[0] + "/colors"
    if slot in {"double/head_left", "double/head_right"}:
        return "double/head"
    if slot.endswith("/socket") or module_key.endswith("socket") or "perk_socket" in module_key:
        return slot.split("/", 1)[0] + "/socket"
    return slot


def slot_label(slot: str, *language_layers: dict[str, str]) -> str:
    language_slots = [slot]
    if slot == "double/head":
        language_slots = ["double/head_left", "double/head_right"]
    for language in language_layers:
        for language_slot in language_slots:
            value = strip_formatting(language.get(f"tetra.slot.{language_slot}", ""))
            if value:
                return re.sub(r"[（(](?:左|右|left|right)[）)]$", "", value, flags=re.IGNORECASE).strip()
    if slot in SLOT_LABEL_EXACT:
        return SLOT_LABEL_EXACT[slot]
    tail = slot.rsplit("/", 1)[-1]
    translations = {
        "socket": "镶嵌",
        "binding": "绑定",
        "handle": "手柄",
        "head": "工具头",
        "core": "核心",
        "crystals": "水晶",
        "inscription": "铭文",
        "lining": "内衬",
        "inner": "内层",
        "outer": "主体",
        "arms": "肩甲",
        "legs": "腿甲",
        "sole": "鞋底",
        "upper": "鞋面",
        "base_ring": "戒环",
        "inlay": "镶嵌",
        "base_bracelet": "镯体",
        "chain": "链条",
        "pendant": "挂坠",
        "base_glove": "手套主体",
        "wristband": "腕带",
        "base": "基底",
        "emblem_ring": "徽环",
        "emblem_type": "流派徽记",
        "crown_ring": "冠环",
        "top": "冠顶宝石",
        "totem_shell": "外壳",
        "totem_core": "核心",
        "envelope": "布套",
        "fill": "填充",
        "dye": "染色",
        "slot1": "功能模块",
        "white": "白色核心",
        "colors": "七种色彩模块",
        "red": "红色模块",
        "orange": "橙色模块",
        "yellow": "黄色模块",
        "green": "绿色模块",
        "cyan": "青色模块",
        "blue": "蓝色模块",
        "purple": "紫色模块",
    }
    return translations.get(tail, tail.replace("_", " ").title())


def purpose_from_module(name: str, module: dict[str, Any], description: str) -> str:
    joined = json.dumps(module, ensure_ascii=False)
    if description and not re.search(r"(?i)AOF|移除|替换|旧版|过时", description):
        return compact_sentence(description)
    checks = (
        (("spell", "mana", "arcane"), "调整法术施放与法力表现"),
        (("draw_strength", "velocity", "projectile", "multishot"), "调整远程射击表现"),
        (("generic.armor", "armor_toughness", "blocking"), "提高防护或格挡能力"),
        (("storage", "quiver", "potion"), "扩展携行与储物功能"),
        (("hammer_dig", "pickaxe_dig", "axe_dig", "cut"), "提供采掘或加工能力"),
        (("attack_damage", "sweeping", "jab", "throwable"), "改变近战攻击方式"),
        (("movement_speed", "dodge", "step_height"), "提高移动与探索能力"),
        (("health", "revival", "totem"), "提供生存与保命能力"),
    )
    lowered = joined.lower()
    for needles, purpose in checks:
        if any(needle in lowered for needle in needles):
            return purpose
    return f"让{name}改变这一槽位的功能定位"


@dataclass
class ModuleEntry:
    key: str
    item_key: str
    slots: list[str]
    slot_group: str
    name: str
    description: str
    document: dict[str, Any]
    locked_key: str | None = None


@dataclass
class ScrollEntry:
    key: str
    name: str
    description: str
    data: dict[str, Any]
    source: str
    category: str = "其他技艺"


@dataclass
class QuestNode:
    seed: str
    title: str
    x: float
    y: float
    size: float
    shape: str
    icon: dict[str, Any] | str
    description: list[str]
    dependencies: list[str] = field(default_factory=list)
    hide_dependency_lines: bool = False

    @property
    def id(self) -> str:
        return stable_id(f"quest:{self.seed}")

    @property
    def task_id(self) -> str:
        return stable_id(f"task:{self.seed}")


@dataclass
class SlotCardLayout:
    slot: str
    entries: list[ModuleEntry]
    columns: int
    rows: int
    width: float
    height: float
    column_index: int = 0
    offset_y: float = 0.0


@dataclass
class ItemPanelLayout:
    item_key: str
    cards: list[SlotCardLayout]
    column_widths: list[float]
    width: float
    content_height: float
    total_height: float


class CompendiumGenerator:
    def __init__(self, root: Path):
        self.root = root
        self.mods_dir = root / "mods"
        self.quest_dir = root / "config" / "ftbquests" / "quests" / "chapters"
        self.mod_ids = installed_mod_ids(self.mods_dir)
        self.layers: list[ResourceLayer] = []
        for name in JAR_NAMES:
            path = self.mods_dir / name
            if not path.exists():
                raise FileNotFoundError(f"Missing required installed jar: {path}")
            self.layers.append(load_jar_layer(path))
        self.layers.append(load_kubejs_layer(root))
        self.resources: dict[str, Any] = {}
        self.lang: dict[str, str] = {}
        self.kubejs_lang: dict[str, str] = self.layers[-1].lang
        for layer in self.layers:
            self.resources.update(layer.json_documents)
            self.lang.update(layer.lang)
        self.failed_modules, self.failed_schematics = load_failed_runtime_entries(root / "logs" / "latest.log")
        self.raw_modules: dict[str, dict[str, Any]] = {}
        self.materials: dict[str, list[dict[str, Any]]] = defaultdict(list)
        self.replacement_modules: set[str] = set()
        self.base_templates: dict[str, dict[str, tuple[str, str | None]]] = defaultdict(dict)
        self.module_locks: dict[str, str] = {}
        self.modules: list[ModuleEntry] = []
        self.scrolls: list[ScrollEntry] = []
        self.module_task_ids: dict[str, str] = {}
        self.item_task_ids: dict[str, str] = {}
        self.slot_task_ids: dict[tuple[str, str], str] = {}
        self.scroll_task_ids: dict[str, str] = {}
        self.item_panel_meta: dict[str, dict[str, float]] = {}
        self.excluded_modules: dict[str, str] = {}
        self.excluded_scrolls: dict[str, str] = {}

    def prepare(self) -> None:
        self._load_modules_and_materials()
        self._load_replacements()
        reachable = self._reachable_modules()
        self._build_modules(reachable)
        self._build_scrolls()

    def _load_modules_and_materials(self) -> None:
        for path, document in self.resources.items():
            module_match = re.fullmatch(r"data/tetra/modules/(.+)\.json", path)
            if module_match and isinstance(document, dict):
                self.raw_modules[module_match.group(1)] = document
            material_match = re.fullmatch(r"data/tetra/materials/([^/]+)/.+\.json", path)
            if material_match and isinstance(document, dict) and conditions_allow(document, self.mod_ids):
                if document.get("material") and document.get("key"):
                    if ingredients_available({"ingredient": document.get("material")}, self.mod_ids):
                        entry = dict(document)
                        entry["_resource_category"] = material_match.group(1)
                        self.materials[material_match.group(1)].append(entry)

    def _iter_replacement_documents(self) -> Iterable[tuple[str, Any]]:
        for layer in self.layers:
            for path, document in layer.json_documents.items():
                if re.fullmatch(r"data/tetra/replacements/.+\.json", path):
                    yield f"{layer.name}:{path}", document

    def _load_replacements(self) -> None:
        for source, document in self._iter_replacement_documents():
            entries = document if isinstance(document, list) else []
            for entry in entries:
                if not isinstance(entry, dict) or not conditions_allow(entry, self.mod_ids):
                    continue
                item_id = entry.get("item")
                modules = entry.get("modules")
                if not isinstance(item_id, str) or not isinstance(modules, dict):
                    continue
                for pair in modules.values():
                    if not isinstance(pair, list) or not pair or not isinstance(pair[0], str):
                        continue
                    module_key = pair[0]
                    material = pair[1] if len(pair) > 1 and isinstance(pair[1], str) else None
                    self.replacement_modules.add(module_key)
                    module = self.raw_modules.get(module_key)
                    slots = module.get("slots", []) if isinstance(module, dict) else []
                    suffixes = module.get("slotSuffixes", []) if isinstance(module, dict) else []
                    if not isinstance(slots, list) or not slots:
                        continue
                    for index, slot in enumerate(slots):
                        suffix = suffixes[index] if index < len(suffixes) else ""
                        concrete_key = module_key + suffix
                        self.base_templates[item_id][str(slot)] = (concrete_key, material)
        for item_id, slots in BASE_FALLBACKS.items():
            for slot, pair in slots.items():
                self.base_templates[item_id].setdefault(slot, pair)

    def _reachable_modules(self) -> set[str]:
        # Replacement data is still used to build valid preview item stacks,
        # but replacement-only modules are innate parts of spawned items. They
        # have no workbench schematic and therefore do not belong in the atlas.
        reachable: set[str] = set()
        for path, document in self.resources.items():
            match = re.fullmatch(r"data/tetra/schematics/(.+)\.json", path)
            if not match or not isinstance(document, dict):
                continue
            schematic_key = match.group(1)
            if schematic_key in self.failed_schematics:
                continue
            if not conditions_allow(document, self.mod_ids):
                continue
            for candidate in iter_dicts(document):
                slots = candidate.get("slots")
                outcomes = candidate.get("outcomes")
                if not isinstance(slots, list) or not slots or not isinstance(outcomes, list):
                    continue
                requirement = candidate.get("requirement", document.get("requirement"))
                for outcome in outcomes:
                    if not isinstance(outcome, dict) or not conditions_allow(outcome, self.mod_ids):
                        continue
                    module_key = outcome.get("moduleKey")
                    if not isinstance(module_key, str):
                        continue
                    reachable.add(module_key)
                    if isinstance(requirement, dict) and requirement.get("type") == "tetra:locked":
                        locked_key = requirement.get("key")
                        if isinstance(locked_key, str):
                            self.module_locks[module_key] = locked_key
        return reachable

    def _module_name(self, key: str) -> str:
        candidates = [
            f"tetra.module.{key}.name",
            f"tetra/schematic/{key}.name",
        ]
        if key.startswith("modular_mmt_bow/"):
            bow_key = "bow/" + key.removeprefix("modular_mmt_bow/")
            candidates.extend((f"tetra.module.{bow_key}.name", f"tetra/schematic/{bow_key}.name"))
        for language in (self.kubejs_lang, self.lang):
            for candidate in candidates:
                value = language.get(candidate)
                if value:
                    return strip_formatting(value)
        return key.rsplit("/", 1)[-1].replace("_", " ").title()

    def _module_description(self, key: str) -> str:
        candidates = [f"tetra.module.{key}.description", f"tetra/schematic/{key}.description"]
        if key.startswith("modular_mmt_bow/"):
            bow_key = "bow/" + key.removeprefix("modular_mmt_bow/")
            candidates.extend((f"tetra.module.{bow_key}.description", f"tetra/schematic/{bow_key}.description"))
        for language in (self.kubejs_lang, self.lang):
            for candidate in candidates:
                value = language.get(candidate)
                if value:
                    return value
        return ""

    def _build_modules(self, reachable: set[str]) -> None:
        for key, document in sorted(self.raw_modules.items()):
            reason = None
            if key not in reachable:
                reason = "no usable workbench schematic outcome"
            elif key in self.failed_modules:
                reason = "runtime module load failure"
            elif any(part in key for part in FORBIDDEN_MODULE_PARTS):
                reason = "missing or forbidden optional integration"
            elif not conditions_allow(document, self.mod_ids):
                reason = "unmet mod condition"
            elif not document.get("type"):
                reason = "missing module type"
            elif not isinstance(document.get("slots"), list) or not document.get("slots"):
                reason = "empty module slots"
            elif not isinstance(document.get("variants"), list) or not document.get("variants"):
                reason = "empty module variants"
            item_key = module_item_key(key)
            if not item_key:
                reason = reason or "outside five-chapter item families"
            if item_key == "modular_dark_wand" and "goety" not in self.mod_ids:
                reason = "Goety is not installed"
            if reason:
                self.excluded_modules[key] = reason
                continue
            slots = [str(slot) for slot in document["slots"]]
            self.modules.append(
                ModuleEntry(
                    key=key,
                    item_key=item_key,
                    slots=slots,
                    slot_group=normalized_slot(key, slots),
                    name=self._module_name(key),
                    description=self._module_description(key),
                    document=document,
                    locked_key=self.module_locks.get(key),
                )
            )

    def _scroll_name(self, key: str) -> str:
        if key.startswith("technique/ode_to_"):
            slug = key.rsplit("ode_to_", 1)[-1]
            candidates = (
                f"tetra/schematic/shared/more_mod_tetra/cyrene/ode_to_{slug}.name",
                f"tetra.improvement.ode_to_{slug}.name",
            )
            for language in (self.kubejs_lang, self.lang):
                for candidate in candidates:
                    value = language.get(candidate)
                    if value:
                        return strip_formatting(value)
            return f"{slug.replace('_', ' ').title()}颂歌"
        if key.startswith("mmt_curios/"):
            return STAGE_SCROLL_NAMES.get(key.rsplit("/", 1)[-1], key)
        candidates = (
            f"item.tetra.scroll.{key}.name",
            f"tetra.unlock.tetra.{key}.name",
            f"tetra.unlock.createdelight.{key}.name",
            f"item.tetra.scroll.{key}.prefix",
        )
        for language in (self.kubejs_lang, self.lang):
            for candidate in candidates:
                value = language.get(candidate)
                if value:
                    return strip_formatting(value)
        aliases = {
            "hammer_efficiency": "锤效率专著",
            "axe_efficiency": "斧效率专著",
            "cut_efficiency": "切具效率专著",
            "gem_expertise": "宝石材料专长",
            "metal_expertise": "金属材料专长",
            "wood_expertise": "木材材料专长",
            "stone_expertise": "石材材料专长",
            "fibre_expertise": "纤维材料专长",
            "skin_expertise": "皮革材料专长",
            "bone_expertise": "骨材材料专长",
            "fabric_expertise": "布料材料专长",
            "scale_expertise": "鳞甲材料专长",
            "hone/gild_1": "镀金 I",
            "hone/gild_2": "镀金 II",
            "hone/gild_3": "镀金 III",
            "hone/gild_4": "镀金 IV",
            "hone/gild_5": "镀金 V",
        }
        return aliases.get(key, key.rsplit("/", 1)[-1].replace("_", " ").title())

    def _scroll_description(self, key: str) -> str:
        # ScrollItem.m_7373_ renders this exact key directly below the
        # "schematics" heading. ScrollData.details is only used when opening
        # the separate details screen and is not part of the item tooltip.
        translation_key = f"item.tetra.scroll.{key}.description"
        for language in (self.kubejs_lang, self.lang):
            value = language.get(translation_key)
            if value:
                return value
        return ""

    def _scroll_category(self, key: str) -> str:
        if key in {"hammer_efficiency", "axe_efficiency", "cut_efficiency"}:
            return "效率专著"
        if key.endswith("_expertise"):
            return "材料专长"
        if key in {"sword/howling", "sword/sturdy_guard", "sword/throwing_knife"}:
            return "原版特殊图纸"
        if key.startswith("hone/gild_"):
            return "镀金技艺"
        if key.startswith("warforge/"):
            return "战争铸造"
        if key.startswith("mmt_curios/"):
            return "饰品阶段卷轴"
        if key == "shared/the_legend_scroll_of_cyrene_titan":
            return "真我之诗"
        if "the_legend_scroll_of_" in key and key.endswith("_titan"):
            slug = key.rsplit("the_legend_scroll_of_", 1)[-1].removesuffix("_titan")
            for group, slugs in TITAN_GROUPS.items():
                if slug in slugs:
                    return f"泰坦卷轴·{group}"
            return "泰坦卷轴"
        if "titan_convergence" in key:
            return "三火种汇卷"
        if "ode_to_" in key:
            return "颂歌"
        if "iron_spell" in key:
            return "法杖卷轴"
        return "通用锻造卷轴"

    def _add_scroll(self, data: dict[str, Any], source: str) -> None:
        key = data.get("key")
        if not isinstance(key, str) or not key:
            return
        if any(part in key for part in FORBIDDEN_SCROLL_PARTS):
            self.excluded_scrolls[key] = "disabled or missing optional integration"
            return
        normalized = copy.deepcopy(data)
        normalized.setdefault("schematics", [f"tetra:{key}"])
        normalized.setdefault("intricate", False)
        normalized.setdefault("material", 1)
        normalized.setdefault("ribbon", "ffffff")
        normalized.setdefault("glyphs", [3, 8, 1, 4])
        self.scrolls.append(
            ScrollEntry(
                key=key,
                name=self._scroll_name(key),
                description=self._scroll_description(key),
                data=normalized,
                source=source,
                category=self._scroll_category(key),
            )
        )

    def _build_scrolls(self) -> None:
        for path, document in sorted(self.resources.items()):
            if not isinstance(document, dict) or not conditions_allow(document, self.mod_ids):
                continue
            if not ingredients_available(document, self.mod_ids):
                continue
            for candidate in iter_dicts(document):
                if candidate.get("function") == "tetra:scroll" and candidate.get("key"):
                    self._add_scroll(candidate, path)
                if candidate.get("item") == "tetra:scroll_rolled" or candidate.get("id") == "tetra:scroll_rolled":
                    nbt = candidate.get("nbt") or candidate.get("tag")
                    if isinstance(nbt, dict):
                        data = nbt.get("BlockEntityTag", {}).get("data", [])
                        if isinstance(data, list):
                            for entry in data:
                                if isinstance(entry, dict):
                                    self._add_scroll(entry, path)
        for key, color in STAGE_SCROLL_COLORS.items():
            self._add_scroll(
                {
                    "key": f"mmt_curios/{key}",
                    "schematics": [f"createdelight:mmt_curios/{key}"],
                    "intricate": False,
                    "material": 2,
                    "ribbon": color,
                    "glyphs": [3, 8, 1, 4],
                },
                "kubejs/server_scripts/Tetra/mmt_curios_scrolls.js",
            )
        # Tetra's three treatises and nine expertise scrolls are assembled by
        # runtime loot code. Their advancement predicates expose the real key,
        # material and ribbon; glyphs are intentionally not fixed by the loot
        # pool, so the compendium uses one deterministic valid pattern.
        for key, (material, ribbon, glyphs) in BASE_TETRA_SCROLLS.items():
            self._add_scroll(
                {
                    "key": key,
                    "schematics": [f"tetra:{key}"],
                    "intricate": False,
                    "material": material,
                    "ribbon": ribbon,
                    "glyphs": glyphs,
                },
                "tetra runtime scroll loot pool",
            )
        deduplicated: dict[str, ScrollEntry] = {}
        for scroll in self.scrolls:
            deduplicated[scroll.key] = scroll
        final_gild = deduplicated.get("hone/gild_5")
        if final_gild:
            final_gild.name = "镀金卷轴（I–V）"
            for level in range(1, 5):
                deduplicated.pop(f"hone/gild_{level}", None)
        self.scrolls = sorted(deduplicated.values(), key=lambda entry: (entry.category, entry.key))

    def _material_for(self, module: ModuleEntry) -> tuple[str | None, str | None]:
        variants = module.document.get("variants", [])
        for variant in variants:
            if not isinstance(variant, dict):
                continue
            variant_key = variant.get("key")
            accepted = variant.get("materials")
            if not isinstance(variant_key, str) or not isinstance(accepted, list) or not accepted:
                continue
            for material_ref in accepted:
                if not isinstance(material_ref, str) or not material_ref.startswith("tetra:"):
                    continue
                body = material_ref.split(":", 1)[1]
                if "/" not in body:
                    continue
                category, explicit = body.split("/", 1)
                candidates = self.materials.get(category, [])
                if explicit:
                    exact = next((entry for entry in candidates if entry.get("key") == explicit), None)
                    if exact:
                        return variant_key, str(exact["key"])
                preferred = PREFERRED_MATERIALS.get(category, ())
                for key in preferred:
                    if any(entry.get("key") == key for entry in candidates):
                        return variant_key, key
                if candidates:
                    return variant_key, str(sorted(candidates, key=lambda entry: str(entry.get("key")))[0]["key"])
        return None, None

    def _base_stack(self, item_key: str, seed: str) -> dict[str, Any]:
        item_id = ITEM_IDS[item_key]
        tag: dict[str, Any] = {"Damage": 0, "id": stable_uuid(f"stack:{seed}")}
        for slot, (module_key, material) in sorted(self.base_templates.get(item_id, {}).items()):
            tag[slot] = module_key
            base_key = re.sub(r"_(left|right)$", "", module_key)
            if material:
                tag[f"{base_key}_material"] = material
        return {"Count": 1, "id": item_id, "tag": tag}

    def _module_stack(self, module: ModuleEntry, seed: str, material_override: str | None = None) -> dict[str, Any]:
        stack = self._base_stack(module.item_key, seed)
        tag = stack["tag"]
        suffixes = module.document.get("slotSuffixes", [])
        variant_key, material_key = self._material_for(module)
        if material_override:
            variant_key = next(
                (
                    variant.get("key")
                    for variant in module.document.get("variants", [])
                    if isinstance(variant, dict) and variant.get("key")
                ),
                variant_key,
            )
            material_key = material_override
        for index, slot in enumerate(module.slots):
            suffix = suffixes[index] if index < len(suffixes) else ""
            concrete = module.key + suffix
            tag[slot] = concrete
            if variant_key and material_key:
                tag[f"{concrete}_material"] = f"{variant_key}{material_key}"
        return stack

    def _scroll_stack(self, scroll: ScrollEntry) -> dict[str, Any]:
        return {
            "Count": 1,
            "id": "tetra:scroll_rolled",
            "tag": {"BlockEntityTag": {"data": [copy.deepcopy(scroll.data)]}},
        }

    def _stack_snbt(self, stack: dict[str, Any], level: int = 0) -> list[str]:
        lines = ["{"]
        lines.append(f"\tCount: {int(stack.get('Count', 1))}")
        lines.append(f"\tid: {quote(str(stack['id']))}")
        tag = stack.get("tag")
        if isinstance(tag, dict):
            lines.append("\ttag: {")
            lines.extend(indent(self._compound_snbt(tag), 2))
            lines.append("\t}")
        lines.append("}")
        return indent(lines, level)

    def _value_snbt(self, value: Any) -> str:
        if isinstance(value, bool):
            return "true" if value else "false"
        if isinstance(value, int):
            return str(value)
        if isinstance(value, float):
            return f"{value:.1f}d"
        if isinstance(value, str):
            return quote(value)
        if isinstance(value, list):
            return "[" + ", ".join(self._value_snbt(child) for child in value) + "]"
        raise TypeError(f"Unsupported SNBT value: {value!r}")

    def _compound_snbt(self, compound: dict[str, Any]) -> list[str]:
        lines: list[str] = []
        for key, value in compound.items():
            rendered_key = key if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key) else quote(key)
            if isinstance(value, dict):
                lines.append(f"{rendered_key}: {{")
                lines.extend(indent(self._compound_snbt(value)))
                lines.append("}")
            elif isinstance(value, list) and value and all(isinstance(child, dict) for child in value):
                lines.append(f"{rendered_key}: [")
                for child in value:
                    lines.append("\t{")
                    lines.extend(indent(self._compound_snbt(child), 2))
                    lines.append("\t}")
                lines.append("]")
            else:
                lines.append(f"{rendered_key}: {self._value_snbt(value)}")
        return lines

    def _link(self, label: str, target: str) -> str:
        payload = {
            "text": label,
            "underlined": True,
            "color": "aqua",
            "clickEvent": {"action": "change_page", "value": target},
        }
        return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))

    def _module_description_lines(self, module: ModuleEntry, item_root_id: str) -> list[str]:
        purpose = purpose_from_module(module.name, module.document, module.description)
        lines = [
            f"&e用途：{purpose}。",
            f"&b适合：安装在“{slot_label(module.slot_group, self.kubejs_lang, self.lang)}”槽位。",
        ]
        scroll = self._scroll_for_module(module)
        if scroll:
            lines.append(f"&d需要：{scroll.name}。")
            target = self.scroll_task_ids.get(scroll.key)
            if target:
                lines.append(self._link(f"查看卷轴：{scroll.name}", target))
        else:
            lines.append("&d需要：默认可用，或随对应图纸解锁。")
        improvements = module.document.get("improvements")
        if isinstance(improvements, list) and improvements:
            lines.append("&a改进：在工作台中查看可用打磨、附层或镶嵌。")
        if module.key in WARFORGE_TO_MODULE.values():
            warforge_key = next(key for key, value in WARFORGE_TO_MODULE.items() if value == module.key)
            target = self.scroll_task_ids.get(warforge_key)
            if target:
                lines.append(self._link("查看战争铸造卷轴", target))
        return lines[:6]

    def _scroll_for_module(self, module: ModuleEntry) -> ScrollEntry | None:
        if module.locked_key:
            lock = module.locked_key.removeprefix("tetra:")
            for scroll in self.scrolls:
                schematics = [str(value) for value in scroll.data.get("schematics", [])]
                if module.locked_key in schematics or lock == scroll.key or any(lock in value for value in schematics):
                    return scroll
        if module.item_key == "mmt_iron_staff":
            return next((scroll for scroll in self.scrolls if scroll.key == "single/more_mod_tetra_iron_spell_staff"), None)
        return None

    def _node_snbt(self, node: QuestNode) -> list[str]:
        lines = ["{"]
        if node.dependencies:
            lines.append("\tdependencies: [" + ", ".join(quote(value) for value in node.dependencies) + "]")
        if node.description:
            lines.append("\tdescription: [")
            lines.extend([f"\t\t{quote(line)}" for line in node.description])
            lines.append("\t]")
        if node.hide_dependency_lines:
            lines.append("\thide_dependency_lines: true")
        if isinstance(node.icon, str):
            lines.append(f"\ticon: {quote(node.icon)}")
        else:
            lines.append("\ticon: {")
            lines.extend(self._stack_snbt(node.icon, 2)[1:-1])
            lines.append("\t}")
        lines.append(f"\tid: {quote(node.id)}")
        lines.append(f"\tshape: {quote(node.shape)}")
        lines.append(f"\tsize: {node.size:.2f}d")
        lines.append("\ttasks: [{")
        lines.append(f"\t\tid: {quote(node.task_id)}")
        lines.append(f"\t\ttitle: {quote('阅读' + strip_formatting(node.title))}")
        lines.append("\t\ttype: \"checkmark\"")
        lines.append("\t}]")
        lines.append(f"\ttitle: {quote(node.title)}")
        lines.append(f"\tx: {node.x:.2f}d")
        lines.append(f"\ty: {node.y:.2f}d")
        lines.append("}")
        return lines

    def _chapter_snbt(
        self,
        key: str,
        filename: str,
        title: str,
        order_index: int,
        root_node: QuestNode,
        nodes: list[QuestNode],
    ) -> str:
        chapter_id = stable_id(f"chapter:{key}")
        lines = [
            "{",
            f"\tautofocus_id: {quote(root_node.id)}",
            "\tdefault_hide_dependency_lines: false",
            "\tdefault_quest_shape: \"\"",
            "\tdependency_requirement: \"all_started\"",
            f"\tfilename: {quote(Path(filename).stem)}",
            f"\tgroup: {quote(GROUP_ID)}",
            "\thide_details_until_startable: false",
            "\thide_lock_icon: true",
            "\ticon: {",
        ]
        lines.extend(self._stack_snbt(root_node.icon if isinstance(root_node.icon, dict) else {"Count": 1, "id": root_node.icon}, 2)[1:-1])
        lines.extend(
            [
                "\t}",
                f"\tid: {quote(chapter_id)}",
                f"\torder_index: {order_index}",
                "\tquest_links: [ ]",
                "\tquests: [",
            ]
        )
        for node in [root_node] + nodes:
            lines.extend(indent(self._node_snbt(node), 2))
        lines.extend(["\t]", f"\ttitle: {quote(title)}", "}", ""])
        return "\n".join(lines)

    @staticmethod
    def _balanced_columns(count: int, maximum: int = 4) -> int:
        if count <= 1:
            return 1
        return min(maximum, max(2, math.ceil(math.sqrt(count))))

    def _make_item_panel(
        self,
        item_key: str,
        grouped: dict[str, list[ModuleEntry]],
        extra_height: float = 0.0,
    ) -> ItemPanelLayout:
        cards: list[SlotCardLayout] = []
        for slot, entries in grouped.items():
            columns = self._balanced_columns(len(entries))
            rows = math.ceil(len(entries) / columns)
            width = max(4.5, (columns - 1) * 2.35 + 2.1)
            height = 5.4 + max(0, rows - 1) * 2.1
            cards.append(
                SlotCardLayout(
                    slot=slot,
                    entries=entries,
                    columns=columns,
                    rows=rows,
                    width=width,
                    height=height,
                )
            )

        column_count = 1 if len(cards) <= 1 else 2
        column_heights = [0.0] * column_count
        column_widths = [0.0] * column_count
        for card in cards:
            column_index = min(range(column_count), key=lambda index: (column_heights[index], index))
            card.column_index = column_index
            card.offset_y = column_heights[column_index]
            column_heights[column_index] += card.height + 2.2
            column_widths[column_index] = max(column_widths[column_index], card.width)

        gap = 3.0 if column_count > 1 else 0.0
        width = sum(column_widths) + gap
        content_height = 4.0 + max(column_heights, default=0.0)
        return ItemPanelLayout(
            item_key=item_key,
            cards=cards,
            column_widths=column_widths,
            width=max(width, 5.0),
            content_height=content_height,
            total_height=content_height + extra_height,
        )

    @staticmethod
    def _panel_row_width(panels: list[ItemPanelLayout], gap: float = 5.0) -> float:
        return sum(panel.width for panel in panels) + max(0, len(panels) - 1) * gap

    def _panels_around_width(self, panels: list[ItemPanelLayout], columns: int) -> float:
        split = math.ceil(len(panels) / 2)
        widths = []
        for side_panels in (panels[:split], panels[split:]):
            for start in range(0, len(side_panels), columns):
                widths.append(self._panel_row_width(side_panels[start : start + columns]))
        return max(widths, default=5.0)

    def _place_item_panel(
        self,
        chapter_key: str,
        panel: ItemPanelLayout,
        parent_id: str,
        center_x: float,
        item_y: float,
        direction: int,
        nodes: list[QuestNode],
    ) -> None:
        item_key = panel.item_key
        item_seed = f"{chapter_key}:item:{item_key}"
        item_node = QuestNode(
            seed=item_seed,
            title=f"&a{ITEM_LABELS[item_key]}",
            x=center_x,
            y=item_y,
            size=2.5,
            shape="square",
            icon=self._base_stack(item_key, item_seed),
            description=[
                f"&e用途：查看{ITEM_LABELS[item_key]}的槽位与模块。",
                "&b顺序：先选槽位，再比较同槽位中的命名模块。",
            ],
            dependencies=[parent_id],
        )
        nodes.append(item_node)
        self.item_task_ids[item_key] = item_node.id

        gap = 3.0 if len(panel.column_widths) > 1 else 0.0
        left = center_x - panel.width / 2.0
        column_centers: list[float] = []
        cursor_x = left
        for width in panel.column_widths:
            column_centers.append(cursor_x + width / 2.0)
            cursor_x += width + gap

        for card in panel.cards:
            slot_y = item_y + direction * (4.0 + card.offset_y)
            representative = card.entries[0]
            slot_seed = f"{chapter_key}:slot:{item_key}:{card.slot}"
            slot_node = QuestNode(
                seed=slot_seed,
                title=f"&b{slot_label(card.slot, self.kubejs_lang, self.lang)}",
                x=column_centers[card.column_index],
                y=slot_y,
                size=2.0,
                shape="diamond",
                icon=self._module_stack(representative, slot_seed),
                description=[
                    f"&e用途：汇总“{slot_label(card.slot, self.kubejs_lang, self.lang)}”槽位的当前可用模块。",
                    "&b选择：按用途与手感挑选，不按材料数值拆页。",
                ],
                dependencies=[item_node.id],
            )
            nodes.append(slot_node)
            self.slot_task_ids[(item_key, card.slot)] = slot_node.id

            for index, module in enumerate(card.entries):
                col = index % card.columns
                row = index // card.columns
                module_seed = f"{chapter_key}:module:{module.key}"
                module_node = QuestNode(
                    seed=module_seed,
                    title=module.name,
                    x=slot_node.x + (col - (card.columns - 1) / 2.0) * 2.35,
                    y=slot_y + direction * (2.7 + row * 2.1),
                    size=1.75,
                    shape="circle",
                    icon=self._module_stack(module, module_seed),
                    description=[],
                    dependencies=[slot_node.id],
                    hide_dependency_lines=True,
                )
                self.module_task_ids[module.key] = module_node.id
                nodes.append(module_node)

        self.item_panel_meta[item_key] = {
            "center_x": center_x,
            "item_y": item_y,
            "direction": float(direction),
            "content_edge_y": item_y + direction * panel.content_height,
            "outer_edge_y": item_y + direction * panel.total_height,
            "width": panel.width,
        }

    def _place_item_panels_around(
        self,
        chapter_key: str,
        panels: list[ItemPanelLayout],
        parent_id: str,
        nodes: list[QuestNode],
        center_x: float = 0.0,
        columns: int = 2,
    ) -> None:
        split = math.ceil(len(panels) / 2)
        for direction, side_panels in ((-1, panels[:split]), (1, panels[split:])):
            distance = 5.0
            for start in range(0, len(side_panels), columns):
                row_panels = side_panels[start : start + columns]
                row_width = self._panel_row_width(row_panels)
                cursor_x = center_x - row_width / 2.0
                item_y = direction * distance
                for panel in row_panels:
                    panel_x = cursor_x + panel.width / 2.0
                    self._place_item_panel(
                        chapter_key,
                        panel,
                        parent_id,
                        panel_x,
                        item_y,
                        direction,
                        nodes,
                    )
                    cursor_x += panel.width + 5.0
                distance += max(panel.total_height for panel in row_panels) + 6.0

    def _build_item_chapter(
        self,
        chapter_key: str,
        item_keys: tuple[str, ...],
        title: str,
        filename: str,
        order_index: int,
    ) -> tuple[str, list[QuestNode]]:
        modules_by_item: dict[str, list[ModuleEntry]] = defaultdict(list)
        for module in self.modules:
            if module.item_key in item_keys:
                modules_by_item[module.item_key].append(module)
        first_item = next((key for key in item_keys if modules_by_item.get(key)), item_keys[0])
        root_icon = self._base_stack(first_item, f"{chapter_key}:root")
        root = QuestNode(
            seed=f"{chapter_key}:root",
            title=f"&6{title}",
            x=0.0,
            y=0.0,
            size=3.0,
            shape="hexagon",
            icon=root_icon,
            description=[
                "&e用途：按物品、槽位和命名模块查询当前可用内容。",
                "&b阅读：沿连线从物品进入槽位，再选择具体模块。",
                "&a提示：页面始终可打开，连线只表示归属关系。",
            ],
        )
        panels: list[ItemPanelLayout] = []
        extra_height_by_item: dict[str, float] = {}
        for item_key in item_keys:
            entries = sorted(modules_by_item.get(item_key, []), key=lambda entry: (entry.slot_group, entry.name, entry.key))
            if not entries:
                continue
            grouped: dict[str, list[ModuleEntry]] = defaultdict(list)
            for entry in entries:
                grouped[entry.slot_group].append(entry)
            panels.append(self._make_item_panel(item_key, grouped, extra_height_by_item.get(item_key, 0.0)))
        nodes: list[QuestNode] = []
        columns = 3 if len(panels) >= 5 else 2
        self._place_item_panels_around(chapter_key, panels, root.id, nodes, columns=columns)
        return self._chapter_snbt(chapter_key, filename, title, order_index, root, nodes), nodes

    def _append_special_melee_nodes(self, nodes: list[QuestNode]) -> None:
        module_map = {entry.key: entry for entry in self.modules}
        sword_meta = self.item_panel_meta.get("sword")
        twin_parent = self.module_task_ids.get("sword/more_mod_tetra/mmt_twin_blade")
        if twin_parent and sword_meta and "sword/more_mod_tetra/mmt_twin_blade" in module_map:
            previous = twin_parent
            twin_node = self._node(nodes, twin_parent)
            direction = int(sword_meta["direction"])
            side = -1 if twin_node and twin_node.x < sword_meta["center_x"] else 1
            positions = ((2.5, 0.0), (5.0, 0.0), (2.5, 2.5), (5.0, 2.5))
            for index, (title, description) in enumerate(TWIN_STAGES):
                offset_x, offset_y = positions[index]
                node = QuestNode(
                    seed=f"melee:improvement:twin:{index}",
                    title=f"&d{title}",
                    x=(twin_node.x if twin_node else sword_meta["center_x"]) + side * offset_x,
                    y=(twin_node.y if twin_node else sword_meta["item_y"]) + direction * offset_y,
                    size=1.75,
                    shape="pentagon",
                    icon=self._module_stack(module_map["sword/more_mod_tetra/mmt_twin_blade"], f"twin:{index}"),
                    description=[description, "&b适合：双剑专属连续打磨路线。"],
                    dependencies=[previous],
                )
                nodes.append(node)
                previous = node.id
        hammer_parent = self.module_task_ids.get("double/basic_hammer")
        hammer = module_map.get("double/basic_hammer")
        double_meta = self.item_panel_meta.get("double")
        if hammer_parent and hammer and double_meta:
            hammer_node = self._node(nodes, hammer_parent)
            direction = int(double_meta["direction"])
            side = -1 if hammer_node and hammer_node.x < double_meta["center_x"] else 1
            for index, (title, material, description) in enumerate(HAMMER_MATERIALS):
                nodes.append(
                    QuestNode(
                        seed=f"melee:hammer-material:{material}",
                        title=f"&d{title}",
                        x=(hammer_node.x if hammer_node else double_meta["center_x"]) + side * 2.7,
                        y=(hammer_node.y if hammer_node else double_meta["item_y"]) + direction * (index - 1) * 2.5,
                        size=1.75,
                        shape="octagon",
                        icon=self._module_stack(hammer, f"hammer:{material}", material_override=material),
                        description=[description, "&b适合：制作需要更高锤级的后期部件。"],
                        dependencies=[hammer_parent],
                    )
                )

    @staticmethod
    def _node_y(nodes: list[QuestNode], node_id: str) -> float:
        return next((node.y for node in nodes if node.id == node_id), 0.0)

    @staticmethod
    def _node(nodes: list[QuestNode], node_id: str) -> QuestNode | None:
        return next((node for node in nodes if node.id == node_id), None)

    def build_melee(self) -> str:
        text, nodes = self._build_item_chapter("melee", MELEE_ITEMS, "近战武器与工具", OUTPUTS["melee"], 1)
        self._append_special_melee_nodes(nodes)
        for node in nodes:
            module = next((entry for entry in self.modules if self.module_task_ids.get(entry.key) == node.id), None)
            if module:
                node.description = self._module_description_lines(module, self.item_task_ids[module.item_key])
        root = QuestNode(
            seed="melee:root",
            title="&6近战武器与工具",
            x=0,
            y=0,
            size=3.0,
            shape="hexagon",
            icon=self._base_stack("sword", "melee:root"),
            description=[
                "&e用途：查询剑、单头工具、双头工具与当前可用法杖。",
                "&b阅读：物品连接槽位，槽位连接具体模块。",
                "&a提示：缺失依赖与失效模块不会显示。",
            ],
        )
        return self._chapter_snbt("melee", OUTPUTS["melee"], "近战武器与工具", 1, root, nodes)

    def build_ranged(self) -> str:
        text, nodes = self._build_item_chapter("ranged", RANGED_ITEMS, "远程、防御与携行", OUTPUTS["ranged"], 2)
        for node in nodes:
            module = next((entry for entry in self.modules if self.module_task_ids.get(entry.key) == node.id), None)
            if module:
                node.description = self._module_description_lines(module, self.item_task_ids[module.item_key])
        root = QuestNode(
            seed="ranged:root",
            title="&6远程、防御与携行",
            x=0,
            y=0,
            size=3.0,
            shape="hexagon",
            icon=self._base_stack("bow", "ranged:root"),
            description=[
                "&e用途：查询两类弓、弩、盾牌与工具腰带。",
                "&b阅读：同名模块按完整模块 ID 分别展示。",
                "&a提示：材料方向与改进就地写在模块页。",
            ],
        )
        return self._chapter_snbt("ranged", OUTPUTS["ranged"], "远程、防御与携行", 2, root, nodes)

    def build_armor_curios(self) -> str:
        modules_by_item: dict[str, list[ModuleEntry]] = defaultdict(list)
        for module in self.modules:
            if module.item_key in ARMOR_ITEMS + CURIO_ITEMS:
                modules_by_item[module.item_key].append(module)
        root = QuestNode(
            seed="armor:root",
            title="&6护甲与饰品",
            x=0,
            y=0,
            size=3.0,
            shape="hexagon",
            icon=self._base_stack("armor/chest", "armor:root"),
            description=[
                "&e用途：左侧查询模块化护甲，右侧查询饰品家族。",
                "&b阅读：每个命名模块只出现一次。",
                "&a提示：需要卷轴的模块会显示醒目的“需要”短行。",
            ],
        )
        nodes: list[QuestNode] = []
        panel_groups: list[tuple[str, tuple[str, ...], str, list[ItemPanelLayout], int]] = []
        for side, item_keys, group_title, columns in (
            ("armor", ARMOR_ITEMS, "模块化护甲", 2),
            ("curios", CURIO_ITEMS, "模块化饰品", 4),
        ):
            panels: list[ItemPanelLayout] = []
            for item_key in item_keys:
                entries = sorted(
                    modules_by_item.get(item_key, []),
                    key=lambda entry: (entry.slot_group, entry.name, entry.key),
                )
                if not entries:
                    continue
                grouped: dict[str, list[ModuleEntry]] = defaultdict(list)
                for entry in entries:
                    grouped[entry.slot_group].append(entry)
                panels.append(self._make_item_panel(item_key, grouped))
            panel_groups.append((side, item_keys, group_title, panels, columns))

        armor_width = self._panels_around_width(panel_groups[0][3], panel_groups[0][4])
        curio_width = self._panels_around_width(panel_groups[1][3], panel_groups[1][4])
        centers = {
            "armor": -(armor_width / 2.0 + 4.0),
            "curios": curio_width / 2.0 + 4.0,
        }
        for side, item_keys, group_title, panels, columns in panel_groups:
            first_item = next(panel.item_key for panel in panels)
            group = QuestNode(
                seed=f"armor:group:{side}",
                title=f"&a{group_title}",
                x=centers[side],
                y=0.0,
                size=2.5,
                shape="square",
                icon=self._base_stack(first_item, f"armor:{side}:group"),
                description=[f"&e用途：汇总{group_title}的物品与模块。"],
                dependencies=[root.id],
            )
            nodes.append(group)
            self._place_item_panels_around(
                "armor",
                panels,
                group.id,
                nodes,
                center_x=centers[side],
                columns=columns,
            )
        for node in nodes:
            module = next((entry for entry in self.modules if self.module_task_ids.get(entry.key) == node.id), None)
            if module:
                node.description = self._module_description_lines(module, self.item_task_ids[module.item_key])
        return self._chapter_snbt("armor", OUTPUTS["armor"], "护甲与饰品", 3, root, nodes)

    def _scroll_dependencies(self, scroll: ScrollEntry, category_nodes: dict[str, QuestNode]) -> list[str]:
        return [category_nodes[scroll.category].id]

    @staticmethod
    def _scroll_description_lines(scroll: ScrollEntry) -> list[str]:
        lines = scroll_tooltip_lines(scroll.description)
        if not lines:
            lines = [f"&7{scroll.name}所记录的锻造内容。"]
        if scroll.key == "hone/gild_5":
            lines.append("&a内容：镀金 I–V 共用这一张卷轴。")
        if scroll.key == "shared/the_legend_scroll_of_cyrene_titan":
            lines.append("&d需要：先完成四张三火种汇卷。")
        lines.append("&b使用：放置在锻造区附近后打开加工台。")
        return lines

    def build_scrolls(self) -> str:
        root_scroll = self.scrolls[0]
        root = QuestNode(
            seed="scrolls:root",
            title="&6卷轴与锻造技艺",
            x=0,
            y=0,
            size=3.0,
            shape="hexagon",
            icon=self._scroll_stack(root_scroll),
            description=[
                "&e用途：逐张查询当前可获取卷轴及其解锁内容。",
                "&b使用：将卷轴放在锻造区附近供工作台读取。",
                "&a提示：每个图标都写入真实卷轴数据、缎带与图案。",
            ],
        )
        categories: dict[str, list[ScrollEntry]] = defaultdict(list)
        for scroll in self.scrolls:
            categories[scroll.category].append(scroll)
        category_order = (
            "效率专著",
            "材料专长",
            "原版特殊图纸",
            "镀金技艺",
            "战争铸造",
            "饰品阶段卷轴",
            "通用锻造卷轴",
            "法杖卷轴",
            "泰坦卷轴·命运",
            "泰坦卷轴·基石",
            "泰坦卷轴·创世",
            "泰坦卷轴·灾祸",
            "三火种汇卷",
            "真我之诗",
            "颂歌",
            "其他技艺",
        )
        nodes: list[QuestNode] = []
        category_nodes: dict[str, QuestNode] = {}
        group_specs = (
            (
                "tetra",
                "原版 Tetra",
                ("效率专著", "材料专长", "原版特殊图纸", "镀金技艺", "战争铸造"),
                -20.0,
                -4.0,
                -1,
            ),
            (
                "mmt",
                "MMT 锻造技艺",
                ("饰品阶段卷轴", "通用锻造卷轴", "法杖卷轴", "其他技艺"),
                20.0,
                -4.0,
                -1,
            ),
            (
                "titan",
                "泰坦与颂歌",
                (
                    "泰坦卷轴·命运",
                    "泰坦卷轴·基石",
                    "泰坦卷轴·创世",
                    "泰坦卷轴·灾祸",
                    "三火种汇卷",
                    "真我之诗",
                    "颂歌",
                ),
                0.0,
                4.0,
                1,
            ),
        )
        for group_key, group_title, group_categories, group_x, group_y, direction in group_specs:
            visible_categories = [category for category in group_categories if categories.get(category)]
            if not visible_categories:
                continue
            first_scroll = categories[visible_categories[0]][0]
            group_node = QuestNode(
                seed=f"scrolls:group:{group_key}",
                title=f"&a{group_title}",
                x=group_x,
                y=group_y,
                size=2.5,
                shape="square",
                icon=self._scroll_stack(first_scroll),
                description=[f"&e用途：汇总{group_title}中的实际卷轴。"],
                dependencies=[root.id],
            )
            nodes.append(group_node)

            if group_key == "titan":
                convergence_keys = {
                    "命运": "shared/titan_convergence_fate",
                    "基石": "shared/titan_convergence_foundation",
                    "创世": "shared/titan_convergence_creation",
                    "灾祸": "shared/titan_convergence_calamity",
                }
                scroll_by_key = {scroll.key: scroll for scroll in self.scrolls}
                lane_centers = (-18.0, -6.0, 6.0, 18.0)
                for lane_x, (titan_group, slugs) in zip(lane_centers, TITAN_GROUPS.items()):
                    category = f"泰坦卷轴·{titan_group}"
                    titan_entries = [
                        scroll_by_key[f"shared/the_legend_scroll_of_{slug}_titan"]
                        for slug in slugs
                        if f"shared/the_legend_scroll_of_{slug}_titan" in scroll_by_key
                    ]
                    if not titan_entries:
                        continue
                    category_node = QuestNode(
                        seed=f"scrolls:category:{category}",
                        title=f"&b{category}",
                        x=lane_x,
                        y=9.0,
                        size=2.0,
                        shape="diamond",
                        icon=self._scroll_stack(titan_entries[0]),
                        description=[f"&e用途：汇总{titan_group}组的三张泰坦卷轴。"],
                        dependencies=[group_node.id],
                    )
                    category_nodes[category] = category_node
                    nodes.append(category_node)
                    for index, scroll in enumerate(titan_entries):
                        node = QuestNode(
                            seed=f"scrolls:scroll:{scroll.key}",
                            title=scroll.name,
                            x=lane_x + (index - 1) * 2.5,
                            y=13.0,
                            size=1.75,
                            shape="pentagon",
                            icon=self._scroll_stack(scroll),
                            description=self._scroll_description_lines(scroll),
                            dependencies=[category_node.id],
                            hide_dependency_lines=True,
                        )
                        self.scroll_task_ids[scroll.key] = node.id
                        nodes.append(node)

                    convergence = scroll_by_key.get(convergence_keys[titan_group])
                    if convergence:
                        node = QuestNode(
                            seed=f"scrolls:scroll:{convergence.key}",
                            title=convergence.name,
                            x=lane_x,
                            y=18.0,
                            size=1.9,
                            shape="pentagon",
                            icon=self._scroll_stack(convergence),
                            description=self._scroll_description_lines(convergence),
                            dependencies=[group_node.id],
                        )
                        self.scroll_task_ids[convergence.key] = node.id
                        nodes.append(node)

                category_nodes["三火种汇卷"] = group_node
                final = scroll_by_key.get("shared/the_legend_scroll_of_cyrene_titan")
                if final:
                    node = QuestNode(
                        seed=f"scrolls:scroll:{final.key}",
                        title=final.name,
                        x=0.0,
                        y=23.0,
                        size=2.25,
                        shape="hexagon",
                        icon=self._scroll_stack(final),
                        description=self._scroll_description_lines(final),
                        dependencies=[group_node.id],
                    )
                    self.scroll_task_ids[final.key] = node.id
                    category_nodes["真我之诗"] = group_node
                    nodes.append(node)
                continue

            panel_data: list[tuple[str, list[ScrollEntry], int, int, float, float]] = []
            for category in category_order:
                if category not in visible_categories:
                    continue
                entries = categories[category]
                columns = self._balanced_columns(len(entries))
                rows = math.ceil(len(entries) / columns)
                width = max(5.0, (columns - 1) * 2.35 + 2.1)
                height = 2.5 if len(entries) == 1 else 5.4 + max(0, rows - 1) * 2.1
                panel_data.append((category, entries, columns, rows, width, height))

            distance = 5.0
            for start in range(0, len(panel_data), 3):
                row_panels = panel_data[start : start + 3]
                row_width = sum(panel[4] for panel in row_panels) + max(0, len(row_panels) - 1) * 5.0
                cursor_x = group_x - row_width / 2.0
                category_y = group_y + direction * distance
                for category, entries, columns, rows, width, height in row_panels:
                    category_x = cursor_x + width / 2.0
                    if len(entries) == 1:
                        scroll = entries[0]
                        node = QuestNode(
                            seed=f"scrolls:scroll:{scroll.key}",
                            title=scroll.name,
                            x=category_x,
                            y=category_y,
                            size=2.0,
                            shape="pentagon",
                            icon=self._scroll_stack(scroll),
                            description=self._scroll_description_lines(scroll),
                            dependencies=[group_node.id],
                        )
                        self.scroll_task_ids[scroll.key] = node.id
                        category_nodes[category] = group_node
                        nodes.append(node)
                        cursor_x += width + 5.0
                        continue
                    category_node = QuestNode(
                        seed=f"scrolls:category:{category}",
                        title=f"&b{category}",
                        x=category_x,
                        y=category_y,
                        size=2.0,
                        shape="diamond",
                        icon=self._scroll_stack(entries[0]),
                        description=[f"&e用途：汇总{category}中的当前可获取卷轴。"],
                        dependencies=[group_node.id],
                    )
                    category_nodes[category] = category_node
                    nodes.append(category_node)
                    for index, scroll in enumerate(entries):
                        col = index % columns
                        row = index // columns
                        node = QuestNode(
                            seed=f"scrolls:scroll:{scroll.key}",
                            title=scroll.name,
                            x=category_x + (col - (columns - 1) / 2.0) * 2.35,
                            y=category_y + direction * (2.7 + row * 2.1),
                            size=1.75,
                            shape="pentagon",
                            icon=self._scroll_stack(scroll),
                            description=self._scroll_description_lines(scroll),
                            dependencies=[category_node.id],
                            hide_dependency_lines=True,
                        )
                        self.scroll_task_ids[scroll.key] = node.id
                        nodes.append(node)
                    cursor_x += width + 5.0
                distance += max(panel[5] for panel in row_panels) + 5.0
        node_by_key = {scroll.key: next(node for node in nodes if node.id == self.scroll_task_ids[scroll.key]) for scroll in self.scrolls}
        for scroll in self.scrolls:
            node = node_by_key[scroll.key]
            node.dependencies = self._scroll_dependencies(scroll, category_nodes)
            module_key = WARFORGE_TO_MODULE.get(scroll.key)
            if module_key and module_key in self.module_task_ids:
                node.description.append(self._link("返回对应工具头", self.module_task_ids[module_key]))
            if "iron_spell" in scroll.key and "mmt_iron_staff" in self.item_task_ids:
                node.description.append(self._link("返回模块化法杖", self.item_task_ids["mmt_iron_staff"]))
        self._wire_titan_chain(node_by_key)
        return self._chapter_snbt("scrolls", OUTPUTS["scrolls"], "卷轴与锻造技艺", 4, root, nodes)

    def _wire_titan_chain(self, node_by_key: dict[str, QuestNode]) -> None:
        convergence_nodes: list[QuestNode] = []
        titan_nodes_by_slug: dict[str, QuestNode] = {}
        for slug in {slug for slugs in TITAN_GROUPS.values() for slug in slugs}:
            key = f"shared/the_legend_scroll_of_{slug}_titan"
            if key in node_by_key:
                titan_nodes_by_slug[slug] = node_by_key[key]
        for group, slugs in TITAN_GROUPS.items():
            convergence = next(
                (
                    node
                    for key, node in node_by_key.items()
                    if "titan_convergence" in key and group in self._scroll_name(key)
                ),
                None,
            )
            if not convergence:
                english = {"命运": "fate", "基石": "foundation", "创世": "creation", "灾祸": "calamity"}[group]
                convergence = node_by_key.get(f"shared/titan_convergence_{english}")
            if convergence:
                convergence.dependencies = [titan_nodes_by_slug[slug].id for slug in slugs if slug in titan_nodes_by_slug]
                convergence.hide_dependency_lines = False
                convergence_nodes.append(convergence)
        final = node_by_key.get("shared/the_legend_scroll_of_cyrene_titan")
        if final and convergence_nodes:
            final.dependencies = [node.id for node in convergence_nodes]
            final.hide_dependency_lines = False

    def write_outputs(self) -> dict[str, int]:
        # Build scroll IDs first so module pages can link to them, then build all
        # chapters again after module IDs exist for reverse links.
        self.build_scrolls()
        melee = self.build_melee()
        ranged = self.build_ranged()
        armor = self.build_armor_curios()
        scrolls = self.build_scrolls()
        outputs = {
            OUTPUTS["melee"]: melee,
            OUTPUTS["ranged"]: ranged,
            OUTPUTS["armor"]: armor,
            OUTPUTS["scrolls"]: scrolls,
        }
        for filename, text in outputs.items():
            (self.quest_dir / filename).write_text(text, encoding="utf-8", newline="\n")
        return {filename: text.count("\n\t\t{\n") for filename, text in outputs.items()}

    def remap_basic_chapter(self) -> tuple[str, str]:
        path = self.quest_dir / "Those_Who_Came_Before.snbt"
        text = path.read_text(encoding="utf-8")
        defined = re.findall(r"(?m)^\s*id:\s*\"([0-9A-F]{16})\"", text)
        mapping = {old: stable_id(f"basic:{index}") for index, old in enumerate(defined)}
        old_chapter = next(re.finditer(r"(?m)^\tid:\s*\"([0-9A-F]{16})\"", text)).group(1)
        for old, new in mapping.items():
            text = text.replace(old, new)
        new_chapter = mapping[old_chapter]
        hammer_link = stable_id("quest:melee:hammer-material:iceandfire_fire_dragonsteel")
        endgame_link = stable_id("quest:melee:hammer-material:end_dragon_ingot")
        text = text.replace("111C12092510C3F4", hammer_link)
        text = text.replace("1F7DE13987C20264", endgame_link)
        text = re.sub(r"(?m)^\torder_index:\s*\d+", "\torder_index: 0", text)
        path.write_text(text, encoding="utf-8", newline="\n")
        intro_path = self.quest_dir / "Introduction.snbt"
        intro = intro_path.read_text(encoding="utf-8")
        intro = intro.replace(old_chapter, new_chapter)
        intro_path.write_text(intro, encoding="utf-8", newline="\n")
        return old_chapter, new_chapter

    def write_report(self, counts: dict[str, int], old_basic: str, new_basic: str) -> Path:
        report_path = self.root / "docs" / "plan" / "tetra-compendium-generation-report.md"
        included_by_item: dict[str, int] = defaultdict(int)
        for module in self.modules:
            included_by_item[module.item_key] += 1
        included_by_scroll: dict[str, int] = defaultdict(int)
        for scroll in self.scrolls:
            included_by_scroll[scroll.category] += 1
        lines = [
            "# Tetra 图鉴生成报告",
            "",
            "此文件由 `scripts/generate-tetra-compendium.py` 根据当前安装 JAR、KubeJS 覆盖和运行日志确定性生成。",
            "",
            "## 生成结果",
            "",
            f"- 基础工艺章节 ID：`{old_basic}` → `{new_basic}`",
            f"- 收录模块：{len(self.modules)}",
            f"- 收录卷轴：{len(self.scrolls)}",
            f"- 卷轴专属 tooltip 说明：{sum(bool(scroll.description) for scroll in self.scrolls)} / {len(self.scrolls)}",
            f"- 排除模块：{len(self.excluded_modules)}",
            f"- 排除卷轴：{len(self.excluded_scrolls)}",
            "",
            "### 章节文件",
            "",
        ]
        for filename, count in counts.items():
            lines.append(f"- `{filename}`：约 {count} 个任务节点")
        lines.extend(["", "### 模块分布", ""])
        for item_key, count in sorted(included_by_item.items()):
            lines.append(f"- {ITEM_LABELS.get(item_key, item_key)}：{count}")
        lines.extend(["", "### 卷轴分布", ""])
        for category, count in sorted(included_by_scroll.items()):
            lines.append(f"- {category}：{count}")
        lines.extend(["", "## 关键排除项", ""])
        for key, reason in sorted(self.excluded_modules.items()):
            if (
                any(part in key for part in ("goety", "malum", "eidolon", "botania", "twilight", "mmt_odachi"))
                or "runtime" in reason
                or reason == "unmet mod condition"
            ):
                lines.append(f"- 模块 `{key}`：{reason}")
        for key, reason in sorted(self.excluded_scrolls.items()):
            lines.append(f"- 卷轴 `{key}`：{reason}")
        lines.append("")
        report_path.write_text("\n".join(lines), encoding="utf-8", newline="\n")
        return report_path


def validate_generated(root: Path, generator: CompendiumGenerator) -> list[str]:
    errors: list[str] = []
    quest_dir = root / "config" / "ftbquests" / "quests" / "chapters"
    generated = [quest_dir / "Those_Who_Came_Before.snbt"] + [quest_dir / name for name in OUTPUTS.values()]
    texts = {path: path.read_text(encoding="utf-8") for path in generated}
    all_defined: dict[str, Path] = {}
    for path, text in texts.items():
        if text.count("{") != text.count("}"):
            errors.append(f"Unbalanced braces: {path}")
        if path.name != "Those_Who_Came_Before.snbt":
            for field in (
                "default_hide_dependency_lines: false",
                'dependency_requirement: "all_started"',
                "hide_details_until_startable: false",
                "hide_lock_icon: true",
            ):
                if field not in text:
                    errors.append(f"Missing chapter setting {field}: {path}")
            if "rewards:" in text:
                errors.append(f"Read-only chapter contains rewards: {path}")
        for value in re.findall(r"(?m)^\s*id:\s*\"([0-9A-F]{16})\"", text):
            if int(value, 16) > 0x7FFFFFFFFFFFFFFF:
                errors.append(f"ID exceeds signed long range: {value} in {path}")
            if value in all_defined:
                errors.append(f"Duplicate ID {value}: {all_defined[value]} and {path}")
            all_defined[value] = path
        autofocus = re.search(r"autofocus_id:\s*\"([0-9A-F]{16})\"", text)
        if not autofocus or autofocus.group(1) not in all_defined and autofocus.group(1) not in text:
            errors.append(f"Invalid autofocus_id: {path}")
    combined = "\n".join(texts.values())
    missing_scroll_descriptions = [scroll.key for scroll in generator.scrolls if not scroll.description]
    if missing_scroll_descriptions:
        errors.append(f"Scrolls missing tooltip descriptions: {missing_scroll_descriptions[:10]}")
    scroll_text = texts[quest_dir / OUTPUTS["scrolls"]]
    missing_tooltip_lines = [
        f"{scroll.key}: {line}"
        for scroll in generator.scrolls
        for line in scroll_tooltip_lines(scroll.description)
        if quote(line) not in scroll_text
    ]
    if missing_tooltip_lines:
        errors.append(f"Scroll tooltip lines missing from generated quests: {missing_tooltip_lines[:10]}")
    if "解锁这张卷轴记录的模块、图纸或锻造技艺" in combined:
        errors.append("Generic scroll description leaked into generated quests")
    for forbidden in ("mmt_odachi", "goety", "malum", "eidolon", "botania", "AOF", "aof"):
        if forbidden in combined:
            errors.append(f"Forbidden optional or legacy content leaked into quests: {forbidden}")
    for forbidden_label in (
        "通用剑刃改进与打磨",
        "附层与血槽",
        "配重与剑首",
        "Attachment 0",
        "Slot1",
        "Laminated Stave",
    ):
        if forbidden_label in combined:
            errors.append(f"Unlocalized or empty aggregate label leaked into quests: {forbidden_label}")
    if "twilightforest" not in generator.mod_ids and "twilight_focus" in combined:
        errors.append("Uninstalled Twilight Forest integration leaked into quests: twilight_focus")
    for path in [quest_dir / name for name in OUTPUTS.values()]:
        text = texts[path]
        for icon in re.finditer(r"icon:\s*\{(.*?)\n\s*\}", text, flags=re.S):
            body = icon.group(1)
            if "modular_" in body and "_material" not in body:
                errors.append(f"Modular icon without material NBT in {path}")
            if 'id: "tetra:scroll_rolled"' in body and "BlockEntityTag" not in body:
                errors.append(f"Scroll icon without BlockEntityTag in {path}")
    module_occurrences = {
        module.key: bool(re.search(quote(module.key)[:-1] + r'(?:_[^\"]+)?\"', combined))
        for module in generator.modules
    }
    missing = [key for key, present in module_occurrences.items() if not present]
    if missing:
        errors.append(f"Modules missing from generated quests: {missing[:10]}")
    if (quest_dir / "Introduction.snbt").read_text(encoding="utf-8").count("4B6A861104F42DC2"):
        errors.append("Introduction still points at the old basic chapter ID")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    generator = CompendiumGenerator(root)
    generator.prepare()
    if args.validate_only:
        errors = validate_generated(root, generator)
        if errors:
            print("VALIDATION FAILED")
            for error in errors:
                print(f"- {error}")
            return 1
        print("VALIDATION OK")
        return 0
    counts = generator.write_outputs()
    old_basic, new_basic = generator.remap_basic_chapter()
    report = generator.write_report(counts, old_basic, new_basic)
    errors = validate_generated(root, generator)
    print(f"Included modules: {len(generator.modules)}")
    print(f"Included scrolls: {len(generator.scrolls)}")
    print(f"Excluded modules: {len(generator.excluded_modules)}")
    print(f"Excluded scrolls: {len(generator.excluded_scrolls)}")
    print(f"Report: {report}")
    if errors:
        print("VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("VALIDATION OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
