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
        "lightmanscurrency:coins/coinblock_netherite_from_pile"
    ])
})
