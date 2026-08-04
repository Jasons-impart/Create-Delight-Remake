StartupEvents.postInit(e => {

    global.CDStartupJavaClasses.$CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("create:limestone") //传送门的框架方块
        .destDimID("createdelight:primordial_caves_dimension") //传送维度
        .lightWithItem("minecraft:bone") //激活传送门的物品
        .tintColor(161, 119, 51) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    global.CDStartupJavaClasses.$CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("alexscaves:candy_cane_block") //传送门的框架方块
        .destDimID("createdelight:candy_cavity_dimension") //传送维度
        .lightWithFluid("create_confectionery:caramel")
        .tintColor(216, 131, 51) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门
})
