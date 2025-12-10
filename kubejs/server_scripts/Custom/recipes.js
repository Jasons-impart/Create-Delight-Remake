ServerEvents.recipes(e => {
    e.recipes.create.compacting(
        'minecraft:calcite',
        [
            'minecraft:flint', 
            'minecraft:bone_block', 
            Fluid.of('minecraft:lava', 100)
        ]
    ).id("createdelight:compacting/calcite")
})
