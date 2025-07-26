ServerEvents.recipes(e => {
    e.remove({mod: "create_bs"})
    const {kubejs} = e.recipes
    kubejs.shaped("3x create_bs:wooden_item_vault", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "#minecraft:logs",
        B: "createdieselgenerators:wood_chip",
        C: "minecraft:barrel"
    })
    kubejs.shaped("5x create_bs:copper_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create:item_vault",
        B: "#forge:storage_blocks/copper"
    })
    .id("create_bs:crafting/copper_item_vault")
    
    kubejs.shaped("5x create_bs:iron_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create:item_vault",
        B: "#forge:storage_blocks/iron"
    })
    .id("create_bs:crafting/iron_item_vault")
    kubejs.shaped("5x create_bs:iron_item_vault", [
        "ABA",
        "CAC",
        "ABA"
    ], {
        A: "create_bs:copper_item_vault",
        B: "#forge:ingots/iron",
        C: "#forge:storage_blocks/iron"
    })
    .id("create_bs:crafting/alt_iron_item_vault")

    kubejs.shaped("5x create_bs:gold_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create_bs:iron_item_vault",
        B: "#forge:storage_blocks/gold"
    })
    .id("create_bs:crafting/gold_item_vault")
    kubejs.shaped("5x create_bs:gold_item_vault", [
        "ABA",
        "CAC",
        "ABA"
    ], {
        A: "create_bs:emerald_item_vault",
        B: "#forge:ingots/gold",
        C: "#forge:storage_blocks/gold"
    })
    .id("create_bs:crafting/alt_gold_item_vault")

    kubejs.shaped("5x create_bs:emerald_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create_bs:iron_item_vault",
        B: "#forge:storage_blocks/emerald"
    })
    .id("create_bs:crafting/emerald_item_vault")
    
    kubejs.shaped("5x create_bs:crystal_item_vault", [
        "ABA",
        "CAC",
        "ABA"
    ], {
        A: "create_bs:gold_item_vault",
        B: "#forge:glass",
        C: "#forge:storage_blocks/diamond"
    })
    .id("create_bs:crafting/crystal_item_vault")
    
    kubejs.shaped("5x create_bs:diamond_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create_bs:gold_item_vault",
        B: "#forge:storage_blocks/diamond"
    })
    .id("create_bs:crafting/diamond_item_vault")

    kubejs.shaped("5x create_bs:diamond_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create_bs:crystal_item_vault",
        B: "#forge:gems/diamond"
    })
    .id("create_bs:crafting/alt_diamond_item_vault")
    
    
    kubejs.shaped("5x create_bs:obsidian_item_vault", [
        "ABA",
        "BAB",
        "ABA"
    ], {
        A: "create_bs:diamond_item_vault",
        B: "#forge:obsidian"
    })
    .id("create_bs:crafting/obsidian_item_vault")
    
    kubejs.shaped("5x create_bs:netherite_item_vault", [
        "ABA",
        "CAC",
        "ABA"
    ], {
        A: "create_bs:diamond_item_vault",
        B: "#forge:ingots/netherite",
        C: "#forge:storage_blocks/gold"
    })
    .id("create_bs:crafting/netherite_item_vault")
})