ServerEvents.recipes(e => {
    e.recipes.kubejs.shaped(Item.of('minecraft:enchanted_book').enchant('northstar_curios_compat:space_walk', 1), [
        "AAA",
        "ABA",
        "ACA"
    ], {
        A: "northstar:moon_stone",
        B: "minecraft:book",
        C: "northstar:iron_space_suit_boots"
    }).id("createdelight:space_walk_1")
    e.recipes.kubejs.shaped(Item.of('minecraft:enchanted_book').enchant('northstar_curios_compat:space_walk', 2), [
        "AAA",
        "ABA",
        "ACA"
    ], {
        A: "northstar:mars_stone",
        B: "minecraft:book",
        C: "northstar:martian_steel_space_suit_boots"
    }).id("createdelight:space_walk_2")
})