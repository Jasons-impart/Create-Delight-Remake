/** @format */

ServerEvents.tags("item", (e) => {
  e.add("vintageimprovements:curving_heads", [
    "megacells:accumulation_processor_press",
    "megacells:mega_item_cell_housing",
    "#ae2:inscriber_presses",
  ]);
  e.add("create:upright_on_belt", [
    "ae2:small_quartz_bud",
    "ae2:medium_quartz_bud",
    "ae2:large_quartz_bud",
    "ae2:quartz_cluster",
  ]);
  e.add("createdelight:quartz_glass", "ae2:quartz_glass");
  e.add("createdelight:quartz_vibrant_glass", "ae2:quartz_vibrant_glass");
  e.add("createdelight:glowstone", "minecraft:glowstone_dust");
  e.add("createdelight:sky_stone", "ae2:sky_dust");
  e.add("createdelight:redstone", "minecraft:redstone");
});

ServerEvents.tags("block", e => {
  e.add("ae2:growth_acceleratable", 
    "farmersrespite:tea_bush",
    "farmersrespite:small_tea_bush",
    "neapolitan:vanilla_vine",
    "neapolitan:strawberry_bush",
    "neapolitan:small_banana_frond",
    "neapolitan:banana_frond",
    "neapolitan:large_banana_frond",
    "neapolitan:mint",
    "farmersdelight:brown_mushroom_colony", 
    "farmersdelight:red_mushroom_colony", 
    "mynethersdelight:crimson_fungus_colony", 
    "mynethersdelight:warped_fungus_colony", 
    "collectorsreap:portobello_colony",
    "minecraft:brown_mushroom", 
    "minecraft:red_mushroom", 
    "collectorsreap:portobello", 
    "minecraft:crimson_fungus",
    "minecraft:warped_fungus",
    "mynethersdelight:powdery_cannon",
    "mynethersdelight:bullet_pepper"
  )
})
ServerEvents.tags("fluid", e => {
  e.add("createdelight:spent_liquor", "createdelight:spent_liquor")
})