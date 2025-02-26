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
        "lightmanscurrency:coinmint",
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
    e.replaceInput([
        {id: "lightmanscurrency:item_trader_interface"},
        {id: "lctech:fluid_trader_interface"},
        {id: "lctech:energy_trader_interface"}
    ], "minecraft:iron_ingot", "createutilities:void_steel_ingot")
    e.replaceInput({}, "lctech:battery", "createaddition:modular_accumulator")
})
