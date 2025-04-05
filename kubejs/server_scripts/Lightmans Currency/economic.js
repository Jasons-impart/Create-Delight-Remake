ServerEvents.recipes(e => {
    e.replaceInput({id: "lightmanscurrency:upgrades/coin_chest_magnet_upgrade_1"}, "minecraft:ender_pearl", "create_sa:copper_magnet")
    e.replaceInput({id: "lightmanscurrency:upgrades/network_upgrade"}, "minecraft:ender_eye", 'ae2:singularity')
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:iron_coin",
        ["createdelightcore:copper_coin"]
    ).id("createdelight:copper_2_iron")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:copper_coin",
        ["createdelightcore:gold_coin"]
    ).id("createdelight:gold_2_copper")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:gold_coin",
        ["createdelightcore:emerald_coin"]
    ).id("createdelight:emerald_2_gold")
    e.recipes.minecraft.crafting_shapeless(
        "9x createdelightcore:emerald_coin",
        ["createdelightcore:netherite_coin"]
    ).id("createdelight:netherite_2_emerald")
    e.recipes.kubejs.shaped(
        'lightmanscurrency:trading_core',
        [
            "AAA",
            "ABA",
            "AAA"
        ], {
            A: "createdelightcore:iron_coin",
            B: "createdelightcore:gold_coin"
        }
    ).id("lightmanscurrency:trading_core")
    e.recipes.kubejs.shaped(
        'lightmanscurrency:atm',
        [
            "ABA",
            "ACA",
            "AAA"
        ], {
            A: "#forge:ingots/iron",
            B: "#forge:glass_panes",
            C: "lightmanscurrency:trading_core"
        }
    ).id("lightmanscurrency:atm")
    e.replaceInput({id: "lightmanscurrency:cash_register"}, "minecraft:ender_pearl", "lightmanscurrency:trading_core")
    e.replaceInput({id: "lightmanscurrency:terminal"}, "minecraft:ender_eye", "lightmanscurrency:trading_core")
    e.replaceInput({id: "lightmanscurrency:gem_terminal"}, "minecraft:ender_eye", "lightmanscurrency:trading_core")
    e.recipes.kubejs.shapeless(
        'lightmanscurrency:wallet_ender_dragon',
        [
            "lightmanscurrency:wallet_netherite",
            "minecraft:dragon_breath"
        ]
    ).id("lightmanscurrency:wallet/upgrade_wallet_netherite_to_wallet_ender_dragon")
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
