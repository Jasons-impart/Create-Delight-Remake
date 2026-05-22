---
navigation:
  title: Andesite Pattern Provider
  icon: appliedcreate:andesite_pattern_provider
  parent: index.md
  position: 20
item_ids:
  - appliedcreate:andesite_pattern_provider
  - appliedcreate:andesite_pattern_provider_part
---

# Andesite Pattern Provider

<Row gap="20">
<Column>

<ItemImage id="appliedcreate:andesite_pattern_provider" scale="4" />

The Andesite Pattern Provider is a specialized AE2 pattern provider designed for Create Mechanical Crafters. It can hold up to **9 processing patterns** and automatically distributes ingredients to adjacent Mechanical Crafters in the correct grid positions.

</Column>
</Row>

## Key Features

- **9 Pattern Slots** — Store up to 9 AE2 processing patterns
- **Smart Grid Distribution** — Automatically matches the pattern output to a crafting recipe and places each ingredient into the correct Mechanical Crafter slot, supporting both Create mechanical crafting recipes and vanilla shaped recipes
- **Sliding Placement** — Recipes smaller than the crafter grid are placed correctly; recipes larger than the grid are rejected to prevent wrong crafts
- **Full AE2 Integration** — Functions as a standard AE2 network device with blocking mode, lock crafting, pattern terminal visibility, and priority settings
- **Directional Mode** — Right-click with a wrench to switch to directional mode, just like a standard AE2 pattern provider
- **Cable Subpart** — Available as a cable-attached part for compact builds
- **Upgradeable** — Can be upgraded to a <ItemLink id="appliedcreate:brass_pattern_provider" /> using the <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" />

## Setup

### Block Form

1. **Build** your Mechanical Crafter array and connect the crafters with a wrench
2. **Place** the Andesite Pattern Provider adjacent to any crafter in the array
3. **Connect** to your ME network using AE2 cables
4. **Insert** processing patterns into the provider's GUI

### Cable Subpart Form

<ItemImage id="appliedcreate:andesite_pattern_provider_part" scale="2" />

The Andesite Pattern Provider is also available as a cable subpart. Place it on an AE2 cable face adjacent to your Mechanical Crafter array for more compact setups.

## Creating Processing Patterns

The provider works with **AE2 processing patterns**:

1. Open the AE2 Pattern Terminal
2. Switch to **Processing** mode
3. Set the **inputs** to match the mechanical crafting recipe's ingredients (order does not matter — the provider matches by recipe output)
4. Set the **output** to the recipe result
5. Encode the pattern and place it into the provider

When the ME system receives a crafting request, the provider will:
1. Request all required materials from the ME network
2. Identify the matching recipe (mechanical crafting or vanilla shaped) based on the pattern's output item
3. Verify the recipe fits within the adjacent Mechanical Crafter grid
4. Distribute each ingredient to the correct crafter slot according to the recipe layout
5. Signal the crafters to begin crafting

## Upgrading

Use a <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" /> on the Andesite Pattern Provider to upgrade it to a <ItemLink id="appliedcreate:brass_pattern_provider" /> with 36 pattern slots. All existing patterns are preserved during the upgrade.
