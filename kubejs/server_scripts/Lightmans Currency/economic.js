ServerEvents.recipes(e => {
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelightcore:copper_coin",
    //     "9x createdelightcore:iron_coin"
    // ).id("createdelight:iron_2_copper")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelightcore:gold_coin",
    //     "9x createdelightcore:copper_coin"
    // ).id("createdelight:copper_2_gold")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelightcore:emerald_coin",
    //     "9x createdelightcore:gold_coin"
    // ).id("createdelight:gold_2_emerald")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelightcore:netherite_coin",
    //     "9x createdelightcore:emerald_coin"
    // ).id("createdelight:emerald_2_netherite")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:iron_coin",
        "createdelightcore:copper_coin"
    ).id("createdelight:copper_2_iron")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:copper_coin",
        "createdelightcore:gold_coin"
    ).id("createdelight:gold_2_copper")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:gold_coin",
        "createdelightcore:emerald_coin"
    ).id("createdelight:emerald_2_gold")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:emerald_coin",
        "createdelightcore:netherite_coin"
    ).id("createdelight:netherite_2_emerald")
    e.recipes.minecraft.crafting_shapeless(
        "createdelightcore:iron_coin",
        "createdelight:iron_coin"
    )
    e.recipes.minecraft.crafting_shapeless(
        "createdelightcore:copper_coin",
        "createdelight:copper_coin"
    )
    e.recipes.minecraft.crafting_shapeless(
        "createdelightcore:gold_coin",
        "createdelight:gold_coin"
    )
    e.recipes.minecraft.crafting_shapeless(
        "createdelightcore:emerald_coin",
        "createdelight:emerald_coin"
    )
    e.recipes.minecraft.crafting_shapeless(
        "createdelightcore:netherite_coin",
        "createdelight:netherite_coin"
    )
})

MoreJSEvents.villagerTrades(e => {
    e.removeModdedTrades(["lightmanscurrency:banker"], 1)
    const trades = [
        ["5x createdelightcore:iron_coin", "lightmanscurrency:cash_register"],
        ["createdelightcore:copper_coin", "lightmanscurrency:terminal"],
        ["8x createdelightcore:iron_coin", "lightmanscurrency:atm"],
        ["createdelightcore:copper_coin", 'lightmanscurrency:portable_gem_terminal'],
        ["8x createdelightcore:iron_coin", 'lightmanscurrency:portable_atm'],
        ["4x createdelightcore:iron_coin", "8x createdelightcore:iron_coin", "lightmanscurrency:trading_core"]
    ]
    trades.forEach(trade => {
        if (trade.length > 2) {
            e.addTrade("lightmanscurrency:banker", 1, [trade[0], trade[1]], trade[2])
        } else {
            e.addTrade("lightmanscurrency:banker", 1, [trade[0]], trade[1])
        }
    })
})
