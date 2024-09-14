ServerEvents.recipes(e => {
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelight:copper_coin",
    //     "9x createdelight:iron_coin"
    // ).id("createdelight:iron_2_copper")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelight:gold_coin",
    //     "9x createdelight:copper_coin"
    // ).id("createdelight:copper_2_gold")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelight:emerald_coin",
    //     "9x createdelight:gold_coin"
    // ).id("createdelight:gold_2_emerald")
    // e.recipes.minecraft.crafting_shapeless(
    //     "createdelight:netherite_coin",
    //     "9x createdelight:emerald_coin"
    // ).id("createdelight:emerald_2_netherite")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelight:iron_coin",
        "createdelight:copper_coin"
    ).id("createdelight:copper_2_iron")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelight:copper_coin",
        "createdelight:gold_coin"
    ).id("createdelight:gold_2_copper")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelight:gold_coin",
        "createdelight:emerald_coin"
    ).id("createdelight:emerald_2_gold")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelight:emerald_coin",
        "createdelight:netherite_coin"
    ).id("createdelight:netherite_2_emerald")
})
MoreJSEvents.villagerTrades(e => {
    e.removeModdedTrades(["lightmanscurrency:banker"], 1)
    const trades = [
        ["5x createdelight:iron_coin", "lightmanscurrency:cash_register"],
        ["createdelight:copper_coin", "lightmanscurrency:terminal"],
        ["8x createdelight:iron_coin", "lightmanscurrency:atm"],
        ["createdelight:copper_coin", 'lightmanscurrency:portable_gem_terminal'],
        ["8x createdelight:iron_coin", 'lightmanscurrency:portable_atm'],
        ["4x createdelight:iron_coin", "8x createdelight:iron_coin", "lightmanscurrency:trading_core"]
    ]
    trades.forEach(trade => {
        if( trade.length > 2 ) {
            e.addTrade("lightmanscurrency:banker", 1, [trade[0], trade[1]], trade[2])
        } else {
            e.addTrade("lightmanscurrency:banker", 1, [trade[0]], trade[1])
        }
    });
})