StartupEvents.registry("item", e => {
    // 安山合金粒
    e.create("createdelight:andesite_alloy_nugget")
        .maxStackSize(64)
        .translationKey("item.createdelight.andesite_alloy_nugget")
        .tag("forge:nuggets/andesite_alloy")
    // 土豆加牛肉
    e.create("createdelight:potato_stew_beef", "create:sequenced_assembly")
        .food(food => {
            food.hunger(7)
                .saturation(0.6)
                .meat()
        })
        .translationKey("item.createdelight.potato_stew_beef")
    // 河豚寿司
    e.create("createdelight:fugu_roll")
        .translationKey("item.createdelight.fugu_roll")
        .food(food => {
            food.hunger(7)
                .saturation(1)
        })
    // 注册挂面
    e.create("createdelight:vermicelli")
        .maxStackSize(64)
        .translationKey("item.createdelight.vermicelli")
    // 注册曲奇面团
    e.create("createdelight:persimmon_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.persimmon_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:lemon_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.lemon_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:oatmeal_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.oatmeal_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:green_tea_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.green_tea_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:cranberry_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.cranberry_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:bayberry_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.bayberry_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:chocolate_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.chocolate_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:honey_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.honey_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })
    e.create("createdelight:sweet_berry_cookie_dough")
        .tag("forge:cookie_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.sweet_berry_cookie_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
        })

    // 开酥相关
    e.create("createdelight:butter")
        .maxStackSize(64)
        .translationKey("item.createdelight.butter")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
                .effect("minecraft:nausea", 200, 1, 1.0)
        })
    e.create("createdelight:whipped_cream_bowl")
        .maxStackSize(64)
        .translationKey("item.createdelight.whipped_cream_bowl")
    e.create("createdelight:oil_dough")
        .maxStackSize(64)
        .translationKey("item.createdelight.oil_dough")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
                .effect("minecraft:nausea", 200, 1, 1.0)
        })
    e.create("createdelight:puff_pastry")
        .maxStackSize(64)
        .translationKey("item.createdelight.puff_pastry")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 1.0)
                .effect("minecraft:nausea", 200, 1, 1.0)
        })
    e.create("createdelight:yorkshire_pudding_and_beef")
        .maxStackSize(64)
        .translationKey("item.createdelight.yorkshire_pudding_and_beef")
        .food(food => {
            food.hunger(12)
                .saturation(1)
        })
    e.create("createdelight:oil_dough_with_butter", "create:sequenced_assembly")
        .translationKey("item.createdelight.oil_dough_with_butter")
        .food(food => {
            food.hunger(1)
                .saturation(1)
                .fastToEat()
                .effect("minecraft:hunger", 200, 1, 0.5)
                .effect("minecraft:nausea", 200, 1, 1.0)
        })
    // 板面
    e.create("createdelight:board_noodles")
        .maxStackSize(64)
        .translationKey("item.createdelight.board_noodles")
    // 老冰棍
    e.create("createdelight:empty_popsicle")
        .maxStackSize(64)
        .translationKey("item.createdelight.empty_popsicle")
        .food(food => {
            food.hunger(2)
                .saturation(0.25)
        })
    // 生炸虾仁
    e.create("createdelight:unfried_shrimp")
        .maxStackSize(64)
        .translationKey("item.createdelight.unfried_shrimp")
        .food(food => {
            food.hunger(4)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 生鸡块
    e.create("createdelight:raw_chicken_chip")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_chicken_chip")
        .food(food => {
            food.hunger(2)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 生猪排
    e.create("createdelight:raw_tonkatsu")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_tonkatsu")
        .food(food => {
            food.hunger(4)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 生炸鱼
    e.create("createdelight:raw_fish")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_fish")
        .food(food => {
            food.hunger(3)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 生炸土豆
    e.create("createdelight:unfried_potato")
        .maxStackSize(64)
        .translationKey("item.createdelight.unfried_potato")
        .food(food => {
            food.hunger(2)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 生炸鸡腿
    e.create("createdelight:unfried_chicken_leg")
        .maxStackSize(64)
        .translationKey("item.createdelight.unfried_chicken_leg")
        .food(food => {
            food.hunger(2)
                .saturation(0.5)
                .effect("minecraft:hunger", 600, 1, 0.5)
        })
    // 鱿鱼圈
    e.create("createdelight:raw_calamari")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_calamari")
        .food(food => {
            food.hunger(1)
                .saturation(1)
        })

    // 生潘恩达炸饺
    e.create("createdelight:raw_empanada")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_empanada")
        .food(food => {
            food.hunger(4)
                .saturation(0.25)
        })
    // 生奶酪披萨
    e.create("createdelight:raw_cheese_pizza")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_cheese_pizza")
    // 燕麦面包
    e.create("createdelight:oat_bread")
        .maxStackSize(64)
        .translationKey("item.createdelight.oat_bread")
        .food(food => {
            food.hunger(5)
                .saturation(0.5)
                .effect("minecraft:regeneration", 60, 1, 1.0)
        })
    // 玉米粉
    e.create("createdelight:corn_flour")
        .maxStackSize(64)
        .translationKey("item.createdelight.corn_flour")
    // 腊肠
    e.create("createdelight:salami")
        .maxStackSize(64)
        .translationKey("item.createdelight.salami")
        .food(food => {
            food.hunger(6)
                .saturation(0.7)
                .effect("farmersdelight:nourishment", 600, 1, 1.0)
        })
    // 九转大肠
    e.create("createdelight:braised_intestines_in_brown_sauce")
        .rarity("epic")
        .maxStackSize(16)
        .translationKey("item.createdelight.braised_intestines_in_brown_sauce")
        .food(food => {
            food.hunger(20)
                .saturation(1)
                .effect("farmersdelight:nourishment", 6000, 1, 1.0)
        })
    //清水白菜
    e.create("createdelight:boiling_water_cabbage")
        .rarity("uncommon")
        .maxStackSize(64)
        .translationKey("item.createdelight.boiling_water_cabbage")
        .food(food => {
            food.hunger(8)
                .saturation(0.6)
                .effect("minecraft:resistance", 500, 2, 1.0)
                .effect("farmersdelight:nourishment", 3000, 1, 1.0)
                .eaten(EatenEvent => {
                    let player = EatenEvent.getPlayer()
                    if (EatenEvent.getPlayer() != null) {
                        player.give("minecraft:bowl")
                    }
                })
        })
    // 玉米热狗相关
    e.create("createdelight:mayo_corn_dog")
        .maxStackSize(64)
        .translationKey("item.createdelight.mayo_corn_dog")
        .food(food => {
            food.hunger(8)
                .saturation(0.6)
                .effect("minecraft:resistance", 200, 1, 1.0)
        })
    e.create("createdelight:ketchup_corn_dog")
        .maxStackSize(64)
        .translationKey("item.createdelight.ketchup_corn_dog")
        .food(food => {
            food.hunger(8)
                .saturation(0.6)
                .effect("minecraft:fire_resistance", 200, 1, 1.0)
        })
    //空饭团
    e.create("createdelight:empty_riceball")
        .food(food => {
            food.hunger(4)
                .saturation(0.6)
        })
        .translationKey("item.createdelight.empty_riceball")
    //未完成的寿司
    e.create("createdelight:sushi_unrolledroll", "create:sequenced_assembly")
        .translationKey("item.createdelight.sushi_unrolledroll")

    // 未完成相关
    e.create("createdelight:incomplete_layered_magnet", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_layered_magnet")
    e.create("createdelight:incomplete_tesla_coil", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_tesla_coil")
    e.create("createdelight:incomplete_alternator", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_alternator")
    e.create("createdelight:incomplete_diesel_engine", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_diesel_engine")
    e.create("createdelight:incomplete_basic_motor", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_basic_motor")
    e.create("createdelight:incomplete_advanced_motor", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_advanced_motor")
    e.create("createdelight:incomplete_reinforced_motor", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_reinforced_motor")
    e.create("createdelight:incomplete_carbon_brushes", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_carbon_brushes")
    e.create("createdelight:incomplete_electric_motor", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_electric_motor")
    e.create("createdelight:incomplete_huge_diesel_engine", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_huge_diesel_engine")
    e.create("createdelight:incomplete_large_diesel_engine", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_large_diesel_engine")
    e.create("createdelight:incompleted_modular_accumulator", "create:sequenced_assembly")
        .translationKey("item.createdelight.incompleted_modular_accumulator")
    e.create("createdelight:incomplete_electron_tube", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_electron_tube")
    e.create("createdelight:bleak_electron_tube")
        .translationKey("item.createdelight.bleak_electron_tube")
    e.create("createdelight:incomplete_fs_upgrade", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_fs_upgrade")
    e.create("createdelight:incomplete_graviton_tube", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_graviton_tube")
    // 未完成的子弹
    e.create("createdelight:incomplete_12g", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_12g")
    e.create("createdelight:incomplete_slap", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_slap")
    e.create("createdelight:incomplete_rbapb", "create:sequenced_assembly")
        .texture("create:item/brass_sheet")
        .translationKey("item.createdelight.incomplete_rbapb")
    e.create("createdelight:incomplete_gas_pistol_ammo", "create:sequenced_assembly")
        .texture("create:item/copper_sheet")
        .translationKey("item.createdelight.incomplete_gas_pistol_ammo")


    // 测试剑
    // e.create("createdelight:sigma_man_sword", "sword")
    //     .tier("netherite")
    //     .attackDamageBonus(999999)
    //     .unstackable()
    //     .translationKey("item.createdelight:sigma_man_sword")
    //     .rarity("epic")

    // 异界笔记
    e.create("createdelight:otherworld_note")
        .maxStackSize(64)
        .translationKey("item.createdelight.otherworld_note")
        .rarity("rare")

    // 通用压印模板（ae用）
    e.create("createdelight:universal_press")
        .tag("vintageimprovements:curving_heads")
        .translationKey("item.createdelight.universal_press")
    // 红石膏
    e.create("createdelight:redstone_paste")
        .maxDamage(64)
        .translationKey("item.createdelight.redstone_paste")
        .tag("createdelight:redstone")
    // 荧石膏
    e.create("createdelight:glowstone_paste")
        .maxDamage(64)
        .translationKey("item.createdelight.glowstone_paste")
        .tag("createdelight:glowstone")
    // 陨石膏
    e.create("createdelight:sky_stone_paste")
        .maxDamage(64)
        .translationKey("item.createdelight.sky_stone_paste")
        .tag("createdelight:sky_stone")
    // 初加工的电路板
    e.create("createdelight:initial_processing_of_printed_engineering_processor")
        .translationKey("item.createdelight.initial_processing_of_printed_engineering_processor")
    e.create("createdelight:initial_processing_of_printed_calculation_processor")
        .translationKey("item.createdelight.initial_processing_of_printed_calculation_processor")
    e.create("createdelight:initial_processing_of_printed_logic_processor")
        .translationKey("item.createdelight.initial_processing_of_printed_logic_processor")
    e.create("createdelight:initial_processing_of_printed_accumulation_processor")
        .translationKey("item.createdelight.initial_processing_of_printed_accumulation_processor")
    // 待压印的处理器
    e.create("createdelight:engineering_processor_inscribed")
        .translationKey("item.createdelight.engineering_processor_inscribed")
    e.create("createdelight:calculation_processor_inscribed")
        .translationKey("item.createdelight.calculation_processor_inscribed")
    e.create("createdelight:logic_processor_inscribed")
        .translationKey("item.createdelight.logic_processor_inscribed")
    e.create("createdelight:accumulation_processor_inscribed")
        .translationKey("item.createdelight.accumulation_processor_inscribed")

    // 元件外壳坯件
    e.create("createdelight:item_cell_housing_blank")
        .translationKey("item.createdelight.item_cell_housing_blank")
    e.create("createdelight:fluid_cell_housing_blank")
        .translationKey("item.createdelight.fluid_cell_housing_blank")
    e.create("createdelight:mega_item_cell_housing_blank")
        .translationKey("item.createdelight.mega_item_cell_housing_blank")
    e.create("createdelight:mega_fluid_cell_housing_blank")
        .translationKey("item.createdelight.mega_fluid_cell_housing_blank")
    // 初处理的元件外壳
    e.create("createdelight:initial_processing_of_item_cell_housing")
        .translationKey("item.createdelight.initial_processing_of_item_cell_housing")
    e.create("createdelight:initial_processing_of_fluid_cell_housing")
        .translationKey("item.createdelight.initial_processing_of_fluid_cell_housing")
    e.create("createdelight:initial_processing_of_mega_item_cell_housing")
        .translationKey("item.createdelight.initial_processing_of_mega_item_cell_housing")
    e.create("createdelight:initial_processing_of_mega_fluid_cell_housing")
        .translationKey("item.createdelight.initial_processing_of_mega_fluid_cell_housing")
    // 未成型的元件外壳
    e.create("createdelight:unformed_item_cell_housing")
        .translationKey("item.createdelight.unformed_item_cell_housing")
    e.create("createdelight:unformed_fluid_cell_housing")
        .translationKey("item.createdelight.unformed_fluid_cell_housing")
    e.create("createdelight:unformed_mega_item_cell_housing")
        .translationKey("item.createdelight.unformed_mega_item_cell_housing")
    e.create("createdelight:unformed_mega_fluid_cell_housing")
        .translationKey("item.createdelight.unformed_mega_fluid_cell_housing")
    // 石英玻璃部件
    e.create("createdelight:quartz_glass_parts")
        .translationKey("item.createdelight.quartz_glass_parts")
        .tag("createdelight:quartz_glass")
    e.create("createdelight:quartz_vibrant_glass_parts")
        .translationKey("item.createdelight.quartz_vibrant_glass_parts")
        .tag("createdelight:quartz_vibrant_glass")
    // 陨铜锭
    e.create("createdelight:sky_copper_ingot")
        .translationKey("item.createdelight.sky_copper_ingot")
        .fireResistant()
    // 元件外壳封头
    e.create("createdelight:cell_housing_curving_head")
        .translationKey("item.createdelight.cell_housing_curving_head")
        .tag("vintageimprovements:curving_heads")
    // 未完成火箭核心
    e.create("createdelight:incomplete_first_stage_rocket_core", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_first_stage_rocket_core")
    e.create("createdelight:incomplete_second_stage_rocket_core", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_second_stage_rocket_core")
    e.create("createdelight:incomplete_third_stage_rocket_core", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_third_stage_rocket_core")
    e.create("createdelight:incomplete_fourth_stage_rocket_core", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_fourth_stage_rocket_core")
    // 行星齿轮
    e.create("createdelight:incomplete_planet_gear", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_planet_gear")
    e.create("createdelight:planet_gear")
        .translationKey("item.createdelight.planet_gear")
        .rarity("uncommon")

    // 矿石注册
    let clusters = [
        ["overworld_metal", "common"],
        ["overworld_noble_metal", "rare"],
        ["nether", "rare"],
        ["moon", "epic"],
        ["mars", "epic"],
        ["mercury", "common"],
        ["venus", "epic"],
        ["glacio", "epic"],
    ]
    clusters.forEach(cluster => {
        e.create(`createdelight:${cluster[0]}_ore_cluster`)
            .rarity(cluster[1])
            .translationKey(`item.createdelight.${cluster[0]}_ore_cluster`)
    });
    // 特例矿石
    e.create("createdelight:mars_gemstone_cluster")
        .rarity("uncommon")
        .translationKey("item.createdelight.mars_gemstone_cluster")
    // 探矿仪
    e.create("createdelight:prospector")
        .maxStackSize(1)
        .translationKey("item.createdelight.prospector")
    e.create("createdelight:prospector_core")
        .translationKey("item.createdelight.prospector_core")
    // β-正交晶系六方铁
    e.create("createdelight:phase_transition_iron")
        .translationKey("item.createdelight.phase_transition_iron")
    // 人造钻石
    e.create("createdelight:mmd_diamond")
        .translationKey("item.createdelight.mmd_diamond")
        .tag("forge:gems/diamond")

    //未完成的纸
    e.create("createdelight:incomplete_paper")
        .translationKey("item.createdelight.incomplete_paper")
    //废纸
    e.create("createdelight:waste_paper")
        .translationKey("item.createdelight.waste_paper")

    //未完成的皮革
    e.create("createdelight:unfinished_leather")
        .translationKey("item.createdelight.unfinished_leather")

    // DEBUG工具
    e.create("createdelight:debug_reload_tool")
        .translationKey("item.createdelight.debug_reload_tool")
    e.create("createdelight:debug_info_tool")
        .translationKey("item.createdelight.debug_info_tool")

    /**
     * @type {Internal.ItemStack_[]}
     */
    let incomplete_item = [
        "ae2:cell_component_1k",
        "ae2:cell_component_4k",
        "ae2:cell_component_16k",
        "ae2:cell_component_64k",
        "ae2:cell_component_256k",
        "ae2:basic_card",
        "ae2:advanced_card",
        "ae2:formation_core",
        "ae2:annihilation_core",
        "ae2:me_p2p_tunnel",
        "ae2:charged_staff",
        "ae2:entropy_manipulator",
        "ae2:blank_pattern",
        "ae2:wireless_terminal",
        "ae2:wireless_crafting_terminal",
        "ae2wtlib:quantum_bridge_card",
        "ae2wtlib:wireless_pattern_access_terminal",
        "ae2wtlib:wireless_pattern_encoding_terminal",
        "megacells:cell_component_1m",
        "megacells:cell_component_4m",
        "megacells:cell_component_16m",
        "megacells:cell_component_64m",
        "megacells:cell_component_256m",
        "expatternprovider:wireless_ex_pat",
        "expatternprovider:pattern_modifier",
        "expatternprovider:infinity_cell",
        "megacells:mega_energy_cell",
        "megacells:mega_crafting_unit",
        "megacells:decompression_module",
        "ae2:drive",
        "ae2:interface",
        "ae2:energy_cell",
        "ae2:dense_energy_cell",
        "ae2:crafting_unit",
        "ae2:pattern_provider",
        "ae2:molecular_assembler",
        "ae2:controller",
        "expatternprovider:crystal_fixer",
        "createdelight:fire_dragonsteel_armorplate",
        "createdelight:ice_dragonsteel_armorplate",
        "createdelight:lightning_dragonsteel_armorplate"
    ]
    incomplete_item.forEach(item => {
        e.create(`createdelight:incomplete_${item.split(":")[1]}`, "create:sequenced_assembly")
            .translationKey(`item.createdelight.incomplete_${item}`)
    })
    // // AE: 未完成的 熵变机械臂 充能手杖 样板
    // ["charged_staff", "entropy_manipulator", "blank_pattern"]
    // e.create("createdelight:incomplete_", "create:sequenced_assembly").translationKey("item.createdelight.incomplete_").texture("ae2:item/")
    // 
    //龙炎钢插板
    e.create("createdelight:fire_dragonsteel_armorplate")
        .maxDamage(3000)
        .rarity("uncommon")
        .tag("protection_pixel:plates")
        .translationKey("item.createdelight.fire_dragonsteel_armorplate")
    //龙霜钢插板
    e.create("createdelight:ice_dragonsteel_armorplate")
        .maxDamage(3000)
        .rarity("uncommon")
        .tag("protection_pixel:plates")
        .translationKey("item.createdelight.ice_dragonsteel_armorplate")
    //龙霆钢插板
    e.create("createdelight:lightning_dragonsteel_armorplate")
        .maxDamage(3000)
        .rarity("uncommon")
        .tag("protection_pixel:plates")
        .translationKey("item.createdelight.lightning_dragonsteel_armorplate")

    //基因种子
    let seed_quality = ["inferior", "normal", "refined", "pure", "flawless"]
    seed_quality.forEach(q => {
        e.create(`createdelight:${q}_genetic_seed`)
            .translationKey(`item.createdelight.${q}_genetic_seed`)
    })
    //悚怖之心
    e.create("createdelight:dread_heart")
        .rarity("epic")
        .translationKey("item.createdelight.dread_heart") 
    //恶魔之眼
    e.create("createdelight:devil_eye")
        .rarity("epic")
        .translationKey("item.createdelight.devil_eye") 
    //锻造钢板
    e.create("createdelight:forged_steel_sheet")
    .translationKey("item.createdelight.forged_steel_sheet") 
    //恶魔典籍
    e.create("createdelight:demonic_codex")
        .rarity("epic")
        .translationKey("item.createdelight.demonic_codex") 
    
})
