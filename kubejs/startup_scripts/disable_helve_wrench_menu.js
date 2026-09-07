StartupEvents.init(event => {
    const RadialWrenchMenu = Java.loadClass(
        'com.simibubi.create.content.contraptions.wrench.RadialWrenchMenu'
    )
    const ResourceLocation = Java.loadClass(
        'net.minecraft.resources.ResourceLocation'
    )

    RadialWrenchMenu.BLOCK_BLACKLIST.add(
        new ResourceLocation('vintageimprovements:helve_hammer')
    )
    RadialWrenchMenu.BLOCK_BLACKLIST.add(
        new ResourceLocation('vintageimprovements:helve_structure')
    )
    RadialWrenchMenu.BLOCK_BLACKLIST.add(
        new ResourceLocation('vintageimprovements:helve_kinetic')
    )
})