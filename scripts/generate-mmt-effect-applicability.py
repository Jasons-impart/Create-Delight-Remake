#!/usr/bin/env python3
"""Generate Tetra Insight applicability resources from decompiled More Mod Tetra sources."""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path


FIELD_PATTERN = re.compile(
    r'ItemEffect\s+(\w+)\s*=\s*ItemEffect\.get\("(more_mod_tetra:[^"]+)"\)'
)
METHOD_PATTERN = re.compile(
    r'(?:public|private|protected)\s+(?:static\s+)?[^;{}]+?\s+(\w+)\s*\(([^)]*)\)\s*\{'
)
FIELD_REFERENCE_PATTERN = re.compile(r"EffectGuiStats\.(\w+)")
EVENT_PATTERN = re.compile(r"\b([A-Za-z0-9_]+Event)\b")
HELPER_PATTERN = re.compile(
    r"\.(get(?:Main|Off|All|Head|Chest|Legs|Feet|Curios)[A-Za-z0-9_]*|hasCuriosEffectLevel)\s*\("
)


HELPER_PATHS = {
    "getMainHandEffectLevel": (("main_hand",), "item"),
    "getMainHandEffectEfficiency": (("main_hand",), "item"),
    "getOffHandEffectLevel": (("off_hand",), "item"),
    "getOffHandEffectEfficiency": (("off_hand",), "item"),
    "getMainOffHandMaxEffectLevel": (("main_hand", "off_hand"), "held_max"),
    "getMainOffHandMaxEffectEfficiency": (("main_hand", "off_hand"), "held_max"),
    "getMainOffHandSumEffectLevel": (("main_hand", "off_hand"), "held_sum"),
    "getMainOffHandSumEffectEfficiency": (("main_hand", "off_hand"), "held_sum"),
    "getHeadArmorEffectLevel": (("helmet",), "single_piece"),
    "getHeadArmorEffectEfficiency": (("helmet",), "single_piece"),
    "getChestArmorEffectLevel": (("armor",), "single_piece"),
    "getChestArmorEffectEfficiency": (("armor",), "single_piece"),
    "getLegsArmorEffectLevel": (("armor",), "single_piece"),
    "getLegsArmorEffectEfficiency": (("armor",), "single_piece"),
    "getFeetArmorEffectLevel": (("armor",), "single_piece"),
    "getFeetArmorEffectEfficiency": (("armor",), "single_piece"),
    "getAllArmorSumEffectLevel": (("armor",), "armor_sum"),
    "getAllArmorSumEffectEfficiency": (("armor",), "armor_sum"),
    "getAllArmorMaxEffectLevel": (("armor",), "armor_max"),
    "getAllArmorMaxEffectEfficiency": (("armor",), "armor_max"),
    "getCuriosEffectLevel": (("curios",), "curios_sum"),
    "getCuriosEffectEfficiency": (("curios",), "curios_sum"),
    "getCuriosEffectMaxLevel": (("curios",), "curios_max"),
    "getCuriosEffectMaxEfficiency": (("curios",), "curios_max"),
    "hasCuriosEffectLevel": (("curios",), "curios_max"),
}

ALL_EFFECT_HELPERS = {
    "getAllEffectLevel",
    "getAllEffectEfficiency",
}

GUI_ONLY_METHODS = {"init", "tooltip"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_root", type=Path)
    parser.add_argument("output_root", type=Path)
    return parser.parse_args()


def statement_window(text: str, start: int, end: int) -> str:
    left = max(text.rfind(";", max(0, start - 800), start), text.rfind("{", max(0, start - 800), start))
    right = text.find(";", end, min(len(text), end + 800))
    if right < 0:
        right = min(len(text), end + 800)
    return text[left + 1 : right + 1]


def trigger_for(events: set[str], method: str, relative_path: str, key: str, scopes: tuple[str, ...]) -> str:
    if "LivingExperienceDropEvent" in events:
        return "gain_experience"
    if "LivingDropsEvent" in events:
        return "kill_entity"
    if "BreakEvent" in events:
        return "break_block"
    if "BreakSpeed" in events:
        return "mine_block"
    if "CriticalHitEvent" in events:
        return "attack"
    if "LivingHealEvent" in events:
        return "heal"
    if "EntityJoinLevelEvent" in events:
        return "projectile"
    if "MMTFluidCollisionEvent" in events:
        return "ability"
    if "LivingTickEvent" in events or "PlayerTickEvent" in events:
        return "wear_passive"
    if "LivingDeathEvent" in events:
        defensive = (
            "armor" in scopes
            or key.endswith("_revival")
            or key.endswith("_final_stand")
            or "undying" in key
            or "over_postmortal" in key
            or "sanctuary" in key
            or "totem" in key
        )
        return "death" if defensive else "kill_entity"
    if "LivingDamageEvent" in events:
        return "receive_hit"
    if "EffectLevelEvent" in events or "LivingHurtEvent" in events:
        defensive = (
            "armor" in scopes
            or "GuardEffect" in relative_path
            or key.endswith("_guard")
            or key.endswith("_protection")
            or key.startswith("more_mod_tetra:armor_")
            or key.endswith("_thorns")
        )
        return "receive_hit" if defensive else "attack"
    if method in {"drop", "entityKilled", "killEvent", "LivingDeathVampire"}:
        return "kill_entity"
    if method in {"tick", "curioTick", "onEquip", "getLevelsMixin"}:
        return "wear_passive"
    if method in {"use", "SoulUse"}:
        return "use_item"
    if method == "onRightClickBlock":
        return "right_click"
    if method == "pointGet":
        return "break_block"
    if method in {"cri", "onLivingAttack"}:
        return "attack"
    if method == "heal":
        return "heal"
    if method in {"onLivingDamage", "takeDamageEvent"}:
        return "receive_hit"
    if method == "hurt":
        return "receive_hit" if "armor" in scopes else "attack"
    return "unknown"


def fallback_paths(
    relative_path: str,
    key: str,
    method: str,
    method_text: str,
    implements_curio: bool = False,
) -> list[tuple[tuple[str, ...], str]]:
    if method == "processArmorPart":
        return [(('armor',), 'single_piece')]
    if method == "handleModularItem":
        return [(('main_hand', 'off_hand'), 'item')]
    if key.startswith("more_mod_tetra:curios_") or key.startswith("more_mod_tetra:white_"):
        return [(('curios',), 'curios_max')]
    if key in {
        "more_mod_tetra:white_bag",
        "more_mod_tetra:white_quiver",
        "more_mod_tetra:white_scabbard",
    }:
        return [(('curios',), 'curios_max')]
    if "ModularMMTBow" in relative_path:
        return [(('bow',), 'item')]
    if "/Curios/" in relative_path or method == "curioTick" or implements_curio:
        return [(('curios',), 'curios_sum')]
    if relative_path.startswith("ArmorEffect/"):
        return [(('armor',), 'armor_sum')]
    if key.endswith("_arcane_guard"):
        return [
            (("main_hand", "off_hand"), "held_max"),
            (("armor",), "armor_sum"),
        ]
    if key.endswith("_staff_socket"):
        return [(("main_hand", "off_hand"), "held_max")]
    if key in {
        "more_mod_tetra:twin_slash",
        "more_mod_tetra:star_burst_stream",
        "more_mod_tetra:eclipse",
        "more_mod_tetra:eclipse_star_burst_stream",
    }:
        return [(("main_hand", "off_hand"), "held_sum")]
    if "getEffectLevel" in method_text or "getEffectEfficiency" in method_text:
        return [(("main_hand", "off_hand"), "held_max")]
    return [(('unknown',), 'unknown')]


def add_path(paths: dict[str, set[tuple[tuple[str, ...], str, str]]], key: str, scopes: tuple[str, ...], stacking: str, trigger: str) -> None:
    paths[key].add((tuple(scopes), trigger, stacking))


def main() -> None:
    args = parse_args()
    stats_path = args.source_root / "Effect" / "EffectGuiStats.java"
    stats = stats_path.read_text(encoding="utf-8")
    field_to_key = dict(FIELD_PATTERN.findall(stats))
    paths: dict[str, set[tuple[tuple[str, ...], str, str]]] = defaultdict(set)

    for source_path in args.source_root.rglob("*.java"):
        if source_path == stats_path:
            continue
        text = source_path.read_text(encoding="utf-8", errors="replace")
        methods = list(METHOD_PATTERN.finditer(text))
        relative_path = source_path.relative_to(args.source_root).as_posix()
        implements_curio = bool(
            re.search(r"\bimplements\b[^\{]+\bICurioItem\b", text)
        )

        for reference in FIELD_REFERENCE_PATTERN.finditer(text):
            field = reference.group(1)
            key = field_to_key.get(field)
            if key is None:
                continue
            previous_methods = [method for method in methods if method.start() < reference.start()]
            if not previous_methods:
                continue
            method_match = previous_methods[-1]
            method = method_match.group(1)
            if method in GUI_ONLY_METHODS:
                continue
            next_method_start = next(
                (candidate.start() for candidate in methods if candidate.start() > method_match.start()),
                len(text),
            )
            method_text = text[method_match.start() : next_method_start]
            events = set(EVENT_PATTERN.findall(method_match.group(2)))
            if not events:
                events.update(EVENT_PATTERN.findall(text))
            if "BreakSpeed" in method_match.group(2) or "BreakSpeed" in text:
                events.add("BreakSpeed")
            window = statement_window(text, reference.start(), reference.end())
            helpers = set(HELPER_PATTERN.findall(window))
            candidates: list[tuple[tuple[str, ...], str]] = []

            for helper in sorted(helpers):
                if helper in ALL_EFFECT_HELPERS:
                    candidates.extend(
                        [
                            (("main_hand", "off_hand"), "held_max"),
                            (("armor",), "armor_sum"),
                        ]
                    )
                elif helper in HELPER_PATHS:
                    candidates.append(HELPER_PATHS[helper])

            if not candidates and "getCuriosEffects" in method_text and "effects.contains" in window:
                candidates.append((("curios",), "curios_max"))
            if not candidates:
                candidates.extend(
                    fallback_paths(
                        relative_path,
                        key,
                        method,
                        method_text,
                        implements_curio,
                    )
                )

            for scopes, stacking in candidates:
                trigger = trigger_for(events, method, relative_path, key, scopes)
                add_path(paths, key, scopes, stacking, trigger)

    for key in field_to_key.values():
        if key not in paths:
            fallback = fallback_paths("", key, "", "")
            for scopes, stacking in fallback:
                add_path(paths, key, scopes, stacking, "unknown")

    for key, entries in paths.items():
        known_signatures = {
            (scopes, stacking)
            for scopes, trigger, stacking in entries
            if trigger != "unknown"
        }
        paths[key] = {
            entry
            for entry in entries
            if entry[1] != "unknown"
            or (entry[0], entry[2]) not in known_signatures
        }

    args.output_root.mkdir(parents=True, exist_ok=True)
    for key in sorted(field_to_key.values()):
        effect_path = key.split(":", 1)[1]
        definitions = [
            {
                "scopes": list(scopes),
                "triggers": [trigger],
                "stacking": stacking,
            }
            for scopes, trigger, stacking in sorted(paths[key], key=lambda entry: (entry[0], entry[1], entry[2]))
        ]
        payload = {"replace": False, "paths": definitions}
        output_path = args.output_root / f"{effect_path}.json"
        output_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
            newline="\n",
        )

    unknown = sum(
        1
        for entries in paths.values()
        if all(scopes == ("unknown",) for scopes, _, _ in entries)
    )
    print(f"generated={len(field_to_key)} unknown_only={unknown} output={args.output_root}")


if __name__ == "__main__":
    main()
