ServerEvents.recipes(e => {
    const {create} = e.recipes
    cutting(e, "netherexp:hogham", [['mynethersdelight:hoglin_loin', 2], ['minecraft:bone', 1]])
    cutting(e, "netherexp:cooked_hogham", [['mynethersdelight:cooked_loin', 2], ['minecraft:bone', 1]])
})