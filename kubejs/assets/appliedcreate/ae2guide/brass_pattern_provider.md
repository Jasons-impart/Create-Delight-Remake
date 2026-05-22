---
navigation:
  title: Brass Pattern Provider
  icon: appliedcreate:brass_pattern_provider
  parent: index.md
  position: 30
item_ids:
  - appliedcreate:brass_pattern_provider
  - appliedcreate:brass_pattern_provider_part
  - appliedcreate:brass_pattern_provider_upgrade
---

# Brass Pattern Provider

<Row gap="20">
<Column>

<ItemImage id="appliedcreate:brass_pattern_provider" scale="4" />

The Brass Pattern Provider is the upgraded version of the <ItemLink id="appliedcreate:andesite_pattern_provider" />. It functions identically but can hold up to **36 processing patterns**, making it ideal for complex automation setups with many different mechanical crafting recipes.

</Column>
</Row>

## Key Features

- **36 Pattern Slots** — Four times the capacity of the Andesite variant
- **Smart Grid Distribution** — Automatically matches recipes and distributes ingredients to the correct Mechanical Crafter slots, supporting both Create mechanical crafting recipes and vanilla shaped recipes
- **Sliding Placement** — Recipes smaller than the crafter grid are placed correctly; oversized recipes are rejected
- **Full AE2 Integration** — Blocking mode, lock crafting, pattern terminal visibility, priority settings, and all standard AE2 pattern provider features
- **Directional Mode** — Right-click with a wrench to switch to directional mode
- **Cable Subpart** — Available as a cable-attached part for compact builds
- **In-Place Upgrade** — Upgrade from Andesite variant preserving all patterns

## Setup

1. **Build** your Mechanical Crafter array and connect the crafters with a wrench
2. **Place** the Brass Pattern Provider adjacent to any crafter in the array
3. **Connect** to your ME network using AE2 cables
4. **Insert** up to 36 processing patterns

### Cable Subpart Form

<ItemImage id="appliedcreate:brass_pattern_provider_part" scale="2" />

Also available as a cable subpart for compact designs.

## Obtaining

### Upgrading from Andesite

Use a <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" /> on an existing <ItemLink id="appliedcreate:andesite_pattern_provider" /> to upgrade it in-place. All patterns stored in the Andesite variant will be preserved.

<RecipeFor id="appliedcreate:brass_pattern_provider_upgrade" />

## Tips

- Use the Brass Pattern Provider when you have many different mechanical crafting recipes to automate
- The cable subpart form is great for dense ME network builds
- Processing pattern input order does not matter — the provider matches recipes by output item
- Multiple providers can be placed adjacent to the same Mechanical Crafter array for even more pattern capacity
