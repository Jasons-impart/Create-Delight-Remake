ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createdeco:compacting/industrial_iron_ingot",
        "create:industrial_iron_block_from_iron_ingots_stonecutting"]
        )
    remove_recipes_output(e, [
        'createdeco:andesite_sheet',
        'createdeco:zinc_sheet',
        'createdeco:netherite_sheet',
        'createdeco:netherite_nugget',
        'createdeco:gold_coin',
        'createdeco:gold_coinstack',
        'createdeco:netherite_coin',
        'createdeco:netherite_coinstack',
        'createdeco:brass_coin',
        'createdeco:brass_coinstack',
        'createdeco:iron_coin',
        'createdeco:iron_coinstack',
        'createdeco:copper_coin',
        'createdeco:copper_coinstack',
        'createdeco:industrial_iron_coin',
        'createdeco:industrial_iron_coinstack',
        'createdeco:zinc_coin',
        'createdeco:zinc_coinstack',
        'createdeco:andesite_hull',
        'createdeco:brass_hull',
        'createdeco:iron_hull',
        'createdeco:copper_hull',
        'createdeco:industrial_iron_hull',
        'createdeco:zinc_hull',
        'createdeco:iron_ladder'])
    e.replaceInput({input: "#createdeco:internal/plates/zinc_plates"}, "#createdeco:internal/plates/zinc_plates", "#forge:plates/zinc")
    e.replaceInput({input: "#createdeco:internal/plates/andesite_plates"}, "#createdeco:internal/plates/andesite_plates", "#forge:plates/andesite")
})