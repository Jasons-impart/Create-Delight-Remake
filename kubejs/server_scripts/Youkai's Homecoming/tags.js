ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        'youkaishomecoming:green_coffee_bean',
        "youkaishomecoming:cucumber",
        "neapolitan:ice_cubes"
    ])
    e.add('forge:tea_leaves/green', "farmersrespite:green_tea_leaves")
    e.add('forge:tea_leaves/oolong', "farmersrespite:yellow_tea_leaves")
    e.add('forge:tea_leaves/black', "farmersrespite:black_tea_leaves")
    e.add("minecraft:ice", "youkaishomecoming:ice_cube")
    e.add("forge:roe", 'oceanic_delight:salmon_eggs')
})