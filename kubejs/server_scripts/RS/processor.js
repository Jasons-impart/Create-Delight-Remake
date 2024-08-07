ServerEvents.recipes(e => {
    // 处理器粘合物
    e.recipes.create.mixing("8x refinedstorage:processor_binding", [
        "#forge:slimeballs",
        Fluid.of("water 10"),
        "#forge:string"
    ])
        .heated()
        .id("refinedstorage:processor_binding")
    // 粗硅合成及其烧练
    e.recipes.create.mixing("4x createdelight:raw_silicon", [
        "minecraft:quartz",
        "3x #minecraft:coals"
    ])
        .heated()
        .id("rs_kjs:raw_silicon")
    e.recipes.minecraft.smelting("refinedstorage:silicon", "createdelight:raw_silicon")
    // 序列合成：基础处理器
    e.recipes.create.sequenced_assembly("refinedstorage:basic_processor", "refinedstorage:silicon", [
        e.recipes.create.deploying("refinedstorage:raw_basic_processor", ["refinedstorage:raw_basic_processor", "refinedstorage:processor_binding"]),
        e.recipes.create.deploying("refinedstorage:raw_basic_processor", ["refinedstorage:raw_basic_processor", "#forge:plates/copper"]),
        e.recipes.create.deploying("refinedstorage:raw_basic_processor", ["refinedstorage:raw_basic_processor", "#forge:dusts/redstone"]),
        e.recipes.create.deploying("refinedstorage:raw_basic_processor", ["refinedstorage:raw_basic_processor", "#forge:gems/diamond"])
            .keepHeldItem(),
        e.recipes.create.pressing("refinedstorage:raw_basic_processor", "refinedstorage:raw_basic_processor")
    ])
        .transitionalItem("refinedstorage:raw_basic_processor")
        .loops(1)
        .id('refinedstorage:basic_processor')
    // 序列合成：进阶处理器
    e.recipes.create.sequenced_assembly("refinedstorage:improved_processor", "refinedstorage:basic_processor", [
        e.recipes.create.deploying("refinedstorage:raw_improved_processor", ["refinedstorage:raw_improved_processor", "refinedstorage:processor_binding"]),
        e.recipes.create.deploying("refinedstorage:raw_improved_processor", ["refinedstorage:raw_improved_processor", "#forge:plates/gold"]),
        e.recipes.create.deploying("refinedstorage:raw_improved_processor", ["refinedstorage:raw_improved_processor", "#forge:dusts/redstone"]),
        e.recipes.create.deploying("refinedstorage:raw_improved_processor", ["refinedstorage:raw_improved_processor", "#forge:gems/diamond"])
            .keepHeldItem(),
        e.recipes.create.pressing("refinedstorage:raw_improved_processor", "refinedstorage:raw_improved_processor")
    ])
        .transitionalItem("refinedstorage:raw_improved_processor")
        .loops(1)
        .id('refinedstorage:improved_processor')
    // 序列合成：高阶处理器
    e.recipes.create.sequenced_assembly("refinedstorage:advanced_processor", "refinedstorage:improved_processor", [
        e.recipes.create.deploying("refinedstorage:raw_advanced_processor", ["refinedstorage:raw_advanced_processor", "refinedstorage:processor_binding"]),
        e.recipes.create.deploying("refinedstorage:raw_advanced_processor", ["refinedstorage:raw_advanced_processor", "#forge:gems/diamond"]),
        e.recipes.create.deploying("refinedstorage:raw_advanced_processor", ["refinedstorage:raw_advanced_processor", "#forge:dusts/redstone"]),
        e.recipes.create.deploying("refinedstorage:raw_advanced_processor", ["refinedstorage:raw_advanced_processor", "#forge:ingots/netherite"])
            .keepHeldItem(),
        e.recipes.create.pressing("refinedstorage:raw_advanced_processor", "refinedstorage:raw_advanced_processor")
    ])
        .transitionalItem("refinedstorage:raw_advanced_processor")
        .loops(1)
        .id('refinedstorage:advanced_processor')
    // 序列合成：神经处理器
    e.recipes.create.sequenced_assembly('extrastorage:neural_processor', "refinedstorage:advanced_processor", [
        e.recipes.create.deploying('extrastorage:raw_neural_processor', ['extrastorage:raw_neural_processor', "refinedstorage:processor_binding"]),
        e.recipes.create.deploying('extrastorage:raw_neural_processor', ['extrastorage:raw_neural_processor', 'ulterlands:astrumm_ingot']),
        e.recipes.create.deploying('extrastorage:raw_neural_processor', ['extrastorage:raw_neural_processor', "#forge:dusts/redstone"]),
        e.recipes.create.deploying('extrastorage:raw_neural_processor', ['extrastorage:raw_neural_processor', "#forge:ingots/netherite"])
            .keepHeldItem(),
        e.recipes.create.pressing('extrastorage:raw_neural_processor', 'extrastorage:raw_neural_processor')
    ])
        .transitionalItem('extrastorage:raw_neural_processor')
        .loops(1)
        .id("extrastorage:neural_processor")
    // 破坏核心
    e.recipes.create.sequenced_assembly("refinedstorage:destruction_core", "refinedstorage:advanced_processor", [
        e.recipes.create.deploying("refinedstorage:advanced_processor", ["refinedstorage:advanced_processor", "minecraft:diamond_pickaxe"]),
        e.recipes.create.deploying("refinedstorage:advanced_processor", ["refinedstorage:advanced_processor", "minecraft:diamond_block"]),
        e.recipes.create.deploying("refinedstorage:advanced_processor", ["refinedstorage:advanced_processor", "minecraft:diamond_pickaxe"])
    ])
        .transitionalItem("refinedstorage:advanced_processor")
        .loops(1)
        .id("refinedstorage:destruction_core")
    // 成型核心
    e.recipes.create.sequenced_assembly("refinedstorage:construction_core", "refinedstorage:improved_processor", [
        e.recipes.create.deploying("refinedstorage:improved_processor", ["refinedstorage:improved_processor", "minecraft:gold_ingot"]),
        e.recipes.create.deploying("refinedstorage:improved_processor", ["refinedstorage:improved_processor", "#forge:feathers"]),
        e.recipes.create.deploying("refinedstorage:improved_processor", ["refinedstorage:improved_processor", "minecraft:gold_ingot"])
    ])
        .transitionalItem("refinedstorage:improved_processor")
        .loops(1)
        .id("refinedstorage:construction_core")
})
