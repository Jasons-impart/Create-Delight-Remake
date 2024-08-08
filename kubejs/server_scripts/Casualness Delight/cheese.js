ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "refurbished_furniture:cheese"
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
})

BlockEvents.rightClicked(e => {
    const {player, block} = e;
    if (player.mainHandItem.hasTag('forge:tools/knives') && block.id === 'vintagedelight:cheese_wheel') {
        block.set("air");
        block.popItem("4x ad_astra:cheese");
        e.cancel()
    }
})
