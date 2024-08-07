StartupEvents.registry("block", e => {
    e.create('createdelight:garlic', "crop")
        .translationKey("block.createdelight.garlic")
        .renderType("cutout")
        .age(3, builder => {
            builder
                .shape(0, 0, 0, 0, 16, 2, 16)
                .shape(1, 0, 0, 0, 16, 4, 16)
                .shape(2, 0, 0, 0, 16, 8, 16)
                .shape(3, 0, 0, 0, 16, 16, 16)
        })
        .growTick(tickevent => 25)
        .bonemeal(info => 1)
        .dropSeed(true)
        .crop('festival_delicacies:garlic', 1)
        .crop('festival_delicacies:garlic', 0.5)
        .texture(0, "minecraft:block/wheat_stage0")
        .texture(1, "minecraft:block/wheat_stage2")
        .texture(2, "minecraft:block/wheat_stage5")
        .texture(3, "minecraft:block/wheat_stage7")
        .item((seeditem) => {
            seeditem
                .texture("minecraft:item/wheat_seeds")
                .translationKey("item.createdelight.garlic_seed")
        })
})