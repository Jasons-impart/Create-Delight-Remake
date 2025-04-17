ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        'youkaishomecoming:green_tea_leaves', 
        'youkaishomecoming:oolong_tea_leaves', 
        'youkaishomecoming:black_tea_leaves', 
        'youkaishomecoming:tea_seeds',
        'youkaishomecoming:green_coffee_bean',
        'youkaishomecoming:ice_cube'])
    e.add('forge:tea_leaves/green', "farmersrespite:green_tea_leaves")
    e.add('forge:tea_leaves/oolong', "farmersrespite:yellow_tea_leaves")
    e.add('forge:tea_leaves/black', "farmersrespite:black_tea_leaves")
})