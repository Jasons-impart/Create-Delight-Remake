ServerEvents.recipes(e => {
    
    /**
     * 
     * @param {OutputItem_} result 
     * @param {InputItem_} [top] 
     * @param {InputItem_} [middle] 
     * @param {InputItem_} [bottom] 
     * @param {string} [mode]
     * @returns 
     */
    let custom_inscribe = (result, top, middle, bottom, mode) => {
        top = Ingredient.of(top || "minecraft:air")
        middle = Ingredient.of(middle || "minecraft:air")
        bottom = Ingredient.of(bottom || "minecraft:air")
        result = Item.of(result || "minecraft:air")
        mode = mode || "press"
        return e.custom({
            type: "ae2:inscriber",
            ingredients: {
                top: top,
                middle: middle,
                bottom: bottom,
            },
            mode: "press",
            result: result,
        })
    }
    const {create} = e.recipes
    create.mechanical_crafting("createdelight:rune_stone", [
        "AAAAAAAAA",
        "AAAAAAAAA",
        "AAAAAAAAA",
        "AAAAAAAAA",
        "AAAABCCCC",
        "CCCCCCCCC",
        "CCCCCCCCC",
        "CCCCCCCCC",
        "CCCCCCCCC",
    ], {
        A: "ae2:fluix_block",
        B: "irons_spellbooks:arcane_salvage",
        C: "minecraft:obsidian"
    })
    .id("createdelight:mechanical_crafting/rune_stone")
    custom_inscribe("irons_spellbooks:blank_rune", "irons_spellbooks:blank_rune", "createdelight:rune_stone", null, "inscribe")
    .id("irons_spellbooks:inscriber/blank_rune")
})