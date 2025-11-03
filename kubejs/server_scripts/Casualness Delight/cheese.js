const $PieBlock = Java.loadClass("vectorwing.farmersdelight.common.block.PieBlock")
const $CheeseWheelBlock = Java.loadClass("umpaz.brewinandchewin.common.block.CheeseWheelBlock")
const $Integer = Java.loadClass("java.lang.Integer")
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "refurbished_furniture:cheese",
        "refurbished_furniture:slicing/vegetable_pizza_slice_from_cooked_vegetable_pizza",
        "refurbished_furniture:slicing/meatlovers_pizza_slice_from_cooked_meatlovers_pizza",
        "vintagedelight:cheese_pizza",
        "vintagedelight:cheese_pizza_from_slices",
        "vintagedelight:cutting/cheese_pizza_from_cutting",
        "vintagedelight:cutting/cheese_wheel_from_cutting",
        "casualness_delight:cutting_cheese_wheel",
        "refurbished_furniture:cutting/cooked_meatlovers_pizza",
        "refurbished_furniture:cutting/cooked_vegetable_pizza",
        "create_bic_bit:deploying/waxed_unripe_cheese",
        "create_bic_bit:deploying/waxed_young_cheese",
        "create_bic_bit:deploying/waxed_aged_cheese",

    ])
    remove_recipes_input(e, [
        "vintagedelight:meat_pizza",
        "vintagedelight:meat_pizza_slice"
    ])
    remove_recipes_output(e, [
        "vintagedelight:meat_pizza",
        "vintagedelight:meat_pizza_slice"
    ])
    // 幻翼泡芙
    e.recipes.farmersdelight.cooking(
        [
            "phantom_membrane",
            "#forge:cheese",
            "#forge:milk"
        ], "2x casualness_delight:phantom_puff", 1.0, 200
    ).id("casualness_delight:cooking/phantom_puff")
    // 奶酪相关
    e.replaceInput({ id: "culturaldelights:cooking/elote" }, "#forge:milk", "#forge:cheese")
    e.replaceInput({ id: "corn_delight:cooking/nachos_block" }, "#forge:milk", "#forge:cheese")
    combination(e, [
        "create:dough",
        "ad_astra:cheese",
        "minecraft:carrot",
        "minecraft:beetroot",
        "minecraft:potato"
    ], "refurbished_furniture:raw_vegetable_pizza", 1)
    cutting(e, "refurbished_furniture:cooked_meatlovers_pizza", [["refurbished_furniture:meatlovers_pizza_slice", 4]])
    cutting(e, "refurbished_furniture:cooked_vegetable_pizza", [["refurbished_furniture:vegetable_pizza_slice", 4]])
    cutting(e, "vintagedelight:cheese_pizza", [["vintagedelight:cheese_pizza_slice", 4]])
    combination(e, [
        "create:dough",
        "butchercraft:cooked_cubed_beef",
        "farmersdelight:cooked_chicken_cuts",
        "butchercraft:cooked_cubed_pork",
    ], "refurbished_furniture:raw_meatlovers_pizza", 1)
    combination(e, [
        "create:dough",
        "ad_astra:cheese",
        "ad_astra:cheese",
        "ad_astra:cheese",
        "ad_astra:cheese"
    ], "createdelight:raw_cheese_pizza", 1)
    baking(e, "createdelight:raw_cheese_pizza", "vintagedelight:cheese_pizza", 1, "food", 300)
    e.recipes.farmersdelight.cooking([
        "minecraft:sweet_berries",
        "minecraft:sweet_berries",
        "minecraft:sweet_berries",
        "#forge:cheese",
        "farmersdelight:pie_crust",
        "#forge:cheese",
    ], "farmersdelight:sweet_berry_cheesecake", 1.0, 200)
        .id("farmersdelight:sweet_berry_cheesecake")
})

BlockEvents.rightClicked(e => {
    const { player, block } = e;
    if (player.mainHandItem.hasTag("forge:tools/knives")) {
        if (block.id === "vintagedelight:cheese_wheel") {
            let prop = block.properties
            let bites = parseInt(prop.get("bites"))
            if (bites != 3) {
                prop.put("bites", (bites + 1).toString())
                block.set(block.id, prop)
            }
            else
                block.set("air")
            block.popItem("ad_astra:cheese")
            e.cancel()
        }
    }
})
