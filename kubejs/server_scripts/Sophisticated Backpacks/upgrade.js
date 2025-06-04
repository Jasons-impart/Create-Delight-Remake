ServerEvents.recipes((e) => {
  remove_recipes_id(e, [
    "sophisticatedbackpacks:stack_upgrade_omega_tier",
    "sophisticatedbackpacks:stack_upgrade_tier_1_from_starter"
  ])
  // 替换配方：堆叠升级T0.5
  e.shaped("sophisticatedbackpacks:stack_upgrade_starter_tier", ["AAA", "ABA", "AAA"], {
    A: "minecraft:copper_ingot",
    B: "sophisticatedbackpacks:upgrade_base",
  }).id("sophisticatedbackpacks:stack_upgrade_starter_tier");
  // 替换配方：堆叠升级T1
  e.shaped("sophisticatedbackpacks:stack_upgrade_tier_1", ["AAA", "ABA", "AAA"], {
    A: "minecraft:iron_ingot",
    B: "sophisticatedbackpacks:upgrade_base",
  }).id("sophisticatedbackpacks:stack_upgrade_tier_1");
  // 替换配方：堆叠升级T2
  e.shaped("sophisticatedbackpacks:stack_upgrade_tier_2", ["AAA", "ABA", "AAA"], {
    A: "minecraft:gold_ingot",
    B: "sophisticatedbackpacks:stack_upgrade_tier_1",
  }).id("sophisticatedbackpacks:stack_upgrade_tier_2");
  // 替换配方：堆叠升级T3
  e.shaped("sophisticatedbackpacks:stack_upgrade_tier_3", ["AAA", "ABA", "AAA"], {
    A: "minecraft:diamond",
    B: "sophisticatedbackpacks:stack_upgrade_tier_2",
  }).id("sophisticatedbackpacks:stack_upgrade_tier_3");
  // 替换配方：堆叠升级T4
  e.shaped("sophisticatedbackpacks:stack_upgrade_tier_4", ["AAA", "ABA", "AAA"], {
    A: "minecraft:netherite_ingot",
    B: "sophisticatedbackpacks:stack_upgrade_tier_3",
  }).id("sophisticatedbackpacks:stack_upgrade_tier_4");
  // 替换配方：喂食升级
  e.shaped("sophisticatedbackpacks:feeding_upgrade", ["ABA", "CDE", "AFA"], {
    A: "ad_astra:cheese",
    B: "minecraft:golden_carrot",
    C: "minecraft:golden_apple",
    D: "sophisticatedbackpacks:upgrade_base",
    E: "minecraft:glistering_melon_slice",
    F: "minecraft:ender_pearl",
  }).id("sophisticatedbackpacks:feeding_upgrade");
});
