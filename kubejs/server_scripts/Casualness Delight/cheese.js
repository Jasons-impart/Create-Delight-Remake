ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "refurbished_furniture:cheese",
        "refurbished_furniture:slicing/vegetable_pizza_slice_from_cooked_vegetable_pizza",
        "refurbished_furniture:slicing/meatlovers_pizza_slice_from_cooked_meatlovers_pizza",
        "vintagedelight:cheese_pizza",
        "vintagedelight:cheese_pizza_from_slices",
        "vintagedelight:cutting/cheese_pizza_from_cutting"
    ])
    remove_recipes_input(e, [
        'vintagedelight:meat_pizza',
        'vintagedelight:meat_pizza_slice'
    ])
    remove_recipes_output(e, [
        'vintagedelight:meat_pizza',
        'vintagedelight:meat_pizza_slice'
    ])
    // 幻翼泡芙
    e.recipes.farmersdelight.cooking(
        [
            "phantom_membrane",
            "#forge:cheese",
            "#forge:milk"
        ], "2x casualness_delight:phantom_puff", 1.0,200
    ).id("casualness_delight:cooking/phantom_puff")
    // 奶酪相关
    e.recipes.farmersdelight.cutting(
        'casualness_delight:cheese_wheel',
        "#forge:tools/knives",
        '7x casualness_delight:cheese_wheel_slice'
    ).id("casualness_delight:cutting_cheese_wheel")
    e.replaceInput({mod: "vintagedelight"}, 'vintagedelight:cheese_slice', "ad_astra:cheese")
    e.replaceInput({id: "culturaldelights:cooking/elote"}, "#forge:milk", "#forge:cheese")
    e.replaceInput({id: "corn_delight:cooking/nachos_block"}, "#forge:milk", "#forge:cheese")
    e.replaceOutput({mod: "vintagedelight"}, 'vintagedelight:cheese_slice', "ad_astra:cheese")
    combination(e, [
        'create:dough',
        "minecraft:carrot",
        "minecraft:beetroot",
        "minecraft:potato",
        "ad_astra:cheese"
    ], 'refurbished_furniture:raw_vegetable_pizza', 1)
    e.recipes.farmersdelight.cutting(
        'refurbished_furniture:cooked_meatlovers_pizza',
        "#forge:tools/knives",
        '6x refurbished_furniture:meatlovers_pizza_slice'
    ).id("refurbished_furniture:cutting/cooked_meatlovers_pizza")
    e.recipes.farmersdelight.cutting(
        'refurbished_furniture:cooked_vegetable_pizza',
        "#forge:tools/knives",
        '6x refurbished_furniture:vegetable_pizza_slice'
    ).id("refurbished_furniture:cutting/cooked_vegetable_pizza")
    e.recipes.farmersdelight.cutting(
        'vintagedelight:cheese_pizza',
        "#forge:tools/knives",
        '6x vintagedelight:cheese_pizza_slice'
    ).id("refurbished_furniture:cutting/cheese_pizza")
    combination(e, [
        'create:dough',
        'butchercraft:cooked_cubed_beef',
        'farmersdelight:cooked_chicken_cuts',
        'butchercraft:cooked_cubed_pork',
    ], 'refurbished_furniture:raw_meatlovers_pizza', 1)
    combination(e, [
        'create:dough',
        'ad_astra:cheese',
        'ad_astra:cheese',
        'ad_astra:cheese',
        'ad_astra:cheese'
    ], 'createdelight:raw_cheese_pizza', 1)
    baking(e, 'createdelight:raw_cheese_pizza', 'vintagedelight:cheese_pizza', 1, "food", 1200)
})

BlockEvents.rightClicked(e => {
    const {player, block} = e;
    if (player.mainHandItem.hasTag('forge:tools/knives') && block.id === 'vintagedelight:cheese_wheel') {
        block.set("air");
        block.popItem("4x ad_astra:cheese");
        e.cancel()
    }
})
