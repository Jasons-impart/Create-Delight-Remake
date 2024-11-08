const $CustomPortalBuilder = Java.loadClass("net.kyrptonaught.customportalapi.api.CustomPortalBuilder")

StartupEvents.postInit(e => {
    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("create_new_age:magnetite_block")
        .destDimID("createdelight:magnetic_caves_dimension") //传送维度
        .lightWithItem("create_new_age:overcharged_diamond")
        .tintColor(49, 44, 55) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("alexscaves:sulfur") //传送门的框架方块
        .destDimID("createdelight:toxic_caves_dimension") //传送维度
        .lightWithItem("alexscaves:sulfur_dust")
        .tintColor(0, 252, 0) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("minecraft:dark_prismarine") //传送门的框架方块
        .destDimID("createdelight:abyssal_chasm_dimension") //传送维度
        .lightWithWater()
        .tintColor(26, 29, 35) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("create:limestone") //传送门的框架方块
        .destDimID("createdelight:primordial_caves_dimension") //传送维度
        .lightWithItem("minecraft:bone") //激活传送门的物品
        .tintColor(161, 119, 51) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("minecraft:packed_mud") //传送门的框架方块
        .destDimID("createdelight:forlorn_hollows_dimension") //传送维度
        .lightWithItem("art_of_forging:shards_of_malice") //激活传送门的物品
        .tintColor(174, 0, 0) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门

    $CustomPortalBuilder
        .beginPortal() //开始构建自定义传送门
        ["frameBlock(net.minecraft.resources.ResourceLocation)"]("alexscaves:candy_cane_block") //传送门的框架方块
        .destDimID("createdelight:candy_cavity_dimension") //传送维度
        .lightWithFluid("create_confectionery:caramel")
        .tintColor(216, 131, 51) // 传送门的RGB颜色
        .registerPortal(); //注册自定义传送门
})