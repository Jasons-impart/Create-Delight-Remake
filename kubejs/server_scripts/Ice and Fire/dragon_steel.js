ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "iceandfire:dragonforge/dragonsteel_fire_ingot",
        "iceandfire:dragonforge/dragonsteel_ice_ingot",
        "iceandfire:dragonforge/dragonsteel_lightning_ingot"
    ])
    const {createmetallurgy} = e.recipes
    metal_production_line_7(e, ["iceandfire:dragonsteel_fire_block", "iceandfire:dragonsteel_fire_ingot", "createdelightcore:molten_fire_steel"], "heated", 160)
    metal_production_line_7(e, ["iceandfire:dragonsteel_ice_block", "iceandfire:dragonsteel_ice_ingot", "createdelightcore:molten_ice_steel"], "heated", 160)
    metal_production_line_7(e, ["iceandfire:dragonsteel_lightning_block", "iceandfire:dragonsteel_lightning_ingot", "createdelightcore:molten_lightning_steel"], "heated", 160)
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_fire_steel", 90), [Fluid.of("createdelightcore:molten_martian_steel", 90), Fluid.of("createdelight:fire_dragon_blood", 250), "#iceandfire:scales/dragon/fire"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_fire_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_ice_steel", 90), [Fluid.of("createdelightcore:molten_martian_steel", 90), Fluid.of("createdelight:ice_dragon_blood", 250), "#iceandfire:scales/dragon/ice"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_ice_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_lightning_steel", 90), [Fluid.of("createdelightcore:molten_martian_steel", 90), Fluid.of("createdelight:lightning_dragon_blood", 250), "#iceandfire:scales/dragon/lightning"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_lightning_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_fire_steel", 180), [Fluid.of("createdelightcore:molten_fire_steel", 90), Fluid.of("createdelight:fire_dragon_blood", 250), "createdelight:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_fire_steel_2")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_ice_steel", 180), [Fluid.of("createdelightcore:molten_ice_steel", 90), Fluid.of("createdelight:ice_dragon_blood", 250), "createdelight:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_ice_steel_2")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_lightning_steel", 180), [Fluid.of("createdelightcore:molten_lightning_steel", 90), Fluid.of("createdelight:lightning_dragon_blood", 250), "createdelight:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createdelight:alloying/molten_lightning_steel_2")

    // 三流体扩产必须用 alloying：工业坩埚的 bulk_melting 不接受任何流体输入
    // （BulkMeltingRecipe#getMaxFluidInputCount 为 0，且其匹配要求坩埚物品槽中存在物品），
    // 而坩埚内回移的合金功能只扫描 createmetallurgy:alloying 配方。
    // alloying 会同时在熔铸搅拌器（FoundryBasinRecipe 上限 4 流体/3 物品）和坩埚内生效。
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_fire_steel", 180), [
        Fluid.of("createdelightcore:molten_fire_steel", 90),
        Fluid.of("createdelightcore:molten_forged_steel", 90),
        Fluid.of("createdelight:fire_dragon_blood", 250)
    ])
    .heatRequirement("superheated")
    .processingTime(160)
    .id("createdelight:alloying/molten_fire_steel_from_three_fluids")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_ice_steel", 180), [
        Fluid.of("createdelightcore:molten_ice_steel", 90),
        Fluid.of("createdelightcore:molten_forged_steel", 90),
        Fluid.of("createdelight:ice_dragon_blood", 250)
    ])
    .heatRequirement("superheated")
    .processingTime(160)
    .id("createdelight:alloying/molten_ice_steel_from_three_fluids")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_lightning_steel", 180), [
        Fluid.of("createdelightcore:molten_lightning_steel", 90),
        Fluid.of("createdelightcore:molten_forged_steel", 90),
        Fluid.of("createdelight:lightning_dragon_blood", 250)
    ])
    .heatRequirement("superheated")
    .processingTime(160)
    .id("createdelight:alloying/molten_lightning_steel_from_three_fluids")
})
