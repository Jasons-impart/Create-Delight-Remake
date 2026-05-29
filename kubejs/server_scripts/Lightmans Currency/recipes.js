ServerEvents.recipes(e => {
    remove_recipes_type(e, [
        "lightmanscurrency:coin_mint"
    ])
    remove_recipes_output(e, [
        "lightmanscurrency:wallet_copper",
        "lightmanscurrency:wallet_iron",
        "lightmanscurrency:wallet_gold",
        "lightmanscurrency:wallet_emerald",
        "lightmanscurrency:wallet_diamond",
        "lightmanscurrency:wallet_netherite",
        "lctech:battery",
        "lctech:battery_large"
    ])
    remove_recipes_id(e, [
        "lightmanscurrency:atm",
        "lightmanscurrency:coinmint",
        "lightmanscurrency:trading_core",
        "lightmanscurrency:coins/coin_copper_from_pile",
        "lightmanscurrency:coins/coinpile_copper_from_coin",
        "lightmanscurrency:coins/coinpile_copper_from_block",
        "lightmanscurrency:coins/coinblock_copper_from_pile",
        "lightmanscurrency:coins/coin_iron_from_pile",
        "lightmanscurrency:coins/coinpile_iron_from_coin",
        "lightmanscurrency:coins/coinpile_iron_from_block",
        "lightmanscurrency:coins/coinblock_iron_from_pile",
        "lightmanscurrency:coins/coin_gold_from_pile",
        "lightmanscurrency:coins/coinpile_gold_from_coin",
        "lightmanscurrency:coins/coinpile_gold_from_block",
        "lightmanscurrency:coins/coinblock_gold_from_pile",
        "lightmanscurrency:coins/coin_emerald_from_pile",
        "lightmanscurrency:coins/coinpile_emerald_from_coin",
        "lightmanscurrency:coins/coinpile_emerald_from_block",
        "lightmanscurrency:coins/coinblock_emerald_from_pile",
        "lightmanscurrency:coins/coin_diamond_from_pile",
        "lightmanscurrency:coins/coinpile_diamond_from_coin",
        "lightmanscurrency:coins/coinpile_diamond_from_block",
        "lightmanscurrency:coins/coinblock_diamond_from_pile",
        "lightmanscurrency:coins/coin_netherite_from_pile",
        "lightmanscurrency:coins/coinpile_netherite_from_coin",
        "lightmanscurrency:coins/coinpile_netherite_from_block",
        "lightmanscurrency:coins/coinblock_netherite_from_pile",
        "lightmanscurrency:wallet/upgrade_wallet_iron_to_wallet_nether_star",
        "lightmanscurrency:wallet/upgrade_wallet_emerald_to_wallet_nether_star",
        "lightmanscurrency:wallet/upgrade_wallet_gold_to_wallet_nether_star",
        "lightmanscurrency:wallet/upgrade_wallet_diamond_to_wallet_nether_star",
        "lightmanscurrency:wallet/wallet_nether_star",
        "lightmanscurrency:wallet/upgrade_wallet_copper_to_wallet_nether_star"
    ])
    const quarkWoods = ["ancient", "azalea", "blossom"]
    const cardColors = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"]
    quarkWoods.forEach(wood => {
        remove_recipes_id(e, [
            `lightmanscurrency:auction_stand/quark/${wood}`,
            `lightmanscurrency:traders/bookshelf/quark/${wood}`,
            `lightmanscurrency:traders/shelf/quark/${wood}`,
            `lightmanscurrency:traders/shelf2/quark/${wood}`
        ])
        cardColors.forEach(color => {
            e.remove({ id: `lightmanscurrency:traders/card_display/quark/${wood}/${color}` })
        })
    })
    e.replaceInput([
        {id: "lightmanscurrency:item_trader_interface"},
        {id: "lctech:fluid_trader_interface"},
        {id: "lctech:energy_trader_interface"}
    ], "minecraft:iron_ingot", "createutilities:void_steel_ingot")
    e.replaceInput({}, "lctech:battery", "createaddition:modular_accumulator")
})
