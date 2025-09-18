ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_central_kitchen:mixing/coffee",
        "create_central_kitchen:filling/coffee",
        "farmersrespite:brewing/coffee_from_water",
        "farmersrespite:filling/coffee",
        "farmersrespite:filling/long_coffee",
        "farmersrespite:brewing/long_coffee_from_coffee",
        "farmersrespite:filling/strong_coffee",
        "farmersrespite:brewing/strong_coffee_from_coffee",
        "farmersrespite:emptying/coffee",
        "farmersrespite:emptying/long_coffee",
        "farmersrespite:emptying/strong_coffee",
        "farmersrespite:milling/coffee_beans"
    ])
    // 咖啡
    e.recipes.create.mixing(
        Fluid.of("createdelight:americano_fluid", 1000),
        [
            "createcafe:coffee_grounds",
            Fluid.of("water", 1000)
        ]
    )
        .heated()
        .id("createcafe:mixing/coffee/coffee_mixing")
    // 袋装咖啡豆
    e.recipes.minecraft.crafting_shapeless(
        "farmersrespite:coffee_beans_sack",
        ["9x createcafe:roasted_coffee_beans"]
    )
        .id("farmersrespite:coffee_beans_sack")
    e.recipes.minecraft.crafting_shapeless(
        "9x createcafe:roasted_coffee_beans",
        ["farmersrespite:coffee_beans_sack"]
    )
        .id("farmersrespite:coffee_beans")
    // 咖啡豆粉碎
    e.recipes.create.milling(
        [
            "createcafe:coffee_grounds",
            Item.of("2x createcafe:coffee_grounds").withChance(0.25)
        ], "farmersrespite:coffee_beans"
    ).id("farmersrespite:milling/coffee_beans")
    e.recipes.create.filling(
        "createcafe:iced_coffee",
        [
            "createcafe:iced_coffee_cup_ice",
            Fluid.of("createdelight:americano_fluid", 250)
        ]
    ).id("createcafe:filling/coffee/iced_coffee_filling")
})

BlockEvents.rightClicked( e => {
    const {player, hand, block} = e
    if(block.id == "minecraft:basalt" || block.id == "minecraft:polished_basalt" || block.id == "minecraft:smooth_basalt" || block.id == "minecraft:magma_block"){
        let heldItem = player.getItemInHand(hand)
        if(heldItem.is("createcafe:roasted_coffee_beans")){
            block.up.set("farmersrespite:coffee_bush")
            block.up.up.set("farmersrespite:coffee_bush", {half: "upper"})
            player.swing(hand)
            if(!player.isCreative()){
                player.setItemInHand(hand, heldItem.withCount(heldItem.count - 1))
            }
        }
    }
})