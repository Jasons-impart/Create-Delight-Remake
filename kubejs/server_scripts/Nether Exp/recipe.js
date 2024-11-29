ServerEvents.recipes(e => {
    const {create} = e.recipes
    cutting(e, "netherexp:hogham", [['mynethersdelight:hoglin_loin', 2], ['minecraft:bone', 1]])
    cutting(e, "netherexp:cooked_hogham", [['mynethersdelight:cooked_loin', 2], ['minecraft:bone', 1]])
    create.crushing(["3x netherexp:banshee_powder", Item.of("netherexp:banshee_powder", 3).withChance(0.5)], "netherexp:banshee_rod")
    .id("netherexp:crushing/banshee_rod")
})