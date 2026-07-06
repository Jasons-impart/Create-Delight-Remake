# Worldgen Structure Edits

## Use When

Use this reference when changing structure generation, biome allowlists, or modded structure replacements.

## Approach

Check whether the active structure is the original mod structure or a replacement from another structure mod before editing biome config.

For Ice and Fire mausoleums, IDAS currently replaces the active player-facing target:

- `config/idas.toml` has `"Disable Ice and Fire Structures" = true`.
- With that flag enabled, IDAS disables `iceandfire:mausoleum`, `iceandfire:gorgon_temple`, and `iceandfire:graveyard`.
- IDAS directs players from `iceandfire:mausoleum` to `idas:iceandfire/dread_citadel`.
- These two structures do not share biome config.

## Reference Implementations

- `config/iceandfire/mausoleum_biomes.json`
- `kubejs/data/idas/tags/worldgen/biome/has_structure/dread_citadel_biomes.json`
- `config/idas.toml`

## Steps

1. Confirm the structure ID players or quests actually locate.
2. For current Dread Citadel generation, edit `kubejs/data/idas/tags/worldgen/biome/has_structure/dread_citadel_biomes.json`.
3. Keep `config/iceandfire/mausoleum_biomes.json` only as future-proofing in case IDAS is removed or `"Disable Ice and Fire Structures"` is turned off.
4. If biome expansion is not enough, adjust the relevant structure-set data. IDAS Dread Citadel belongs to the `idas_rare` structure set by default.

## Validation

- Validate edited JSON with a parser.
- Use `/locate structure idas:iceandfire/dread_citadel` for the active IDAS structure.
- Use `/locate structure iceandfire:mausoleum` only when IDAS no longer disables Ice and Fire structures.

## Notes

- Expanding `config/iceandfire/mausoleum_biomes.json` does not affect `idas:iceandfire/dread_citadel`.
- Expanding `dread_citadel_biomes.json` does not affect the original `iceandfire:mausoleum`.
