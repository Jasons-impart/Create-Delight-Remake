ServerEvents.recipes(e => {
    e.replaceInput({ id: "mynethersdelight:cooking/spicy_noodle_soup" }, "mynethersdelight:ghasta", "createdelight:vermicelli")
    // 挂面合成
    e.recipes.ratatouille.squeezing(
        "createdelight:vermicelli", "bakeries:whole_wheat_dough"
    ).id("ratatouille:squeezing/vermicelli")
    // 挂面相关
    e.recipes.farmersdelight.cooking(
        [
            "minecraft:carrot",
            "minecraft:brown_mushroom",
            "createdelight:vermicelli",
            "#forge:salad_ingredients",
            "#forge:vegetables"
        ], "farmersdelight:vegetable_noodles", 1.0, 200
    )
        .id("farmersdelight:cooking/vegetable_noodles")
        .container("bowl")
    e.recipes.farmersdelight.cooking(
        [
            "createdelight:vermicelli",
            "#forge:cooked_eggs",
            "minecraft:dried_kelp",
            "forge:raw_pork"
        ], "farmersdelight:noodle_soup", 1.0, 200
    )
        .id("farmersdelight:cooking/noodle_soup")
        .container("bowl")
    e.recipes.farmersdelight.cooking(
        [
            "butchercraft:cubed_beef",
            "butchercraft:cubed_beef",
            "createdelight:board_noodles",
            "#forge:vegetables/carrot",
            "#forge:vegetables/cabbage",
            "#forge:vegetables/onion"
        ], "casualness_delight:beef_noodles", 1.0, 200
    )
        .id("casualness_delight:cooking/beef_noodles")
        .container("bowl")
    // 板面相关
    e.recipes.create.sequenced_assembly("4x createdelight:board_noodles", "bakeries:whole_wheat_dough", [
        e.recipes.create.pressing("bakeries:whole_wheat_dough", "bakeries:whole_wheat_dough"),
        e.recipes.create.cutting("bakeries:whole_wheat_dough", "bakeries:whole_wheat_dough")
    ])
        .transitionalItem("bakeries:whole_wheat_dough")
        .loops(2)
        .id("createdelight:recipes/board_noodles")
    cutting(e, "bakeries:whole_wheat_dough", [["createdelight:board_noodles"]])
})