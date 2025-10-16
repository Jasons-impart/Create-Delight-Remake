ServerEvents.recipes(e => {
    const { kubejs } = e.recipes
    /**
     * 
     * @param {OutputItem_} result 
     * @param {InputItem_} [top] 
     * @param {InputItem_} [middle] 
     * @param {InputItem_} [bottom] 
     * @param {string} [mode]
     * @returns 
     */
    let custom_inscribe = (result, top, middle, bottom, mode) => {
        top = Ingredient.of(top || "minecraft:air")
        middle = Ingredient.of(middle || "minecraft:air")
        bottom = Ingredient.of(bottom || "minecraft:air")
        result = Item.of(result || "minecraft:air")
        mode = mode || "press"
        return e.custom({
            type: "ae2:inscriber",
            ingredients: {
                top: top,
                middle: middle,
                bottom: bottom,
            },
            mode: "press",
            result: result,
        })
    }
    /**
     *  
     * @param {OutputItem_} res 
     * @param {Special.FluidTag} fluid 
     * @param {Internal.Ingredient[]} ingr
     * @returns 
     */
    let transform_fluid = (res, fluid, ingr) => {
        res = Item.of(res || "minecraft:air")
        if (!(ingr instanceof Array))
            ingr = [ingr]
        let ingredients = []
        ingr.forEach(ing => {
            ingredients.push(Ingredient.of(ing))
        })
        return e.custom({
            type: "ae2:transform",
            circumstance: {
                type: "fluid",
                tag: fluid
            },
            ingredients: ingredients,
            result: res
        })
    }
    /**
 *  
 * @param {OutputItem_} res 
 * @param {Internal.Ingredient[]} ingr
 * @returns 
 */
    let transform_explosion = (res, ingr) => {
        res = Item.of(res || "minecraft:air")
        if (!(ingr instanceof Array))
            ingr = [ingr]
        let ingredients = []
        ingr.forEach(ing => {
            ingredients.push(Ingredient.of(ing))
        })
        return e.custom({
            type: "ae2:transform",
            circumstance: {
                type: "explosion"
            },
            ingredients: ingredients,
            result: res
        })
    }
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}'),
        [
            "AAA",
            "ABA",
            "AAA"
        ], {
        A: "#forge:ingots/iron",
        B: "protection_pixel:reinforcedfiber"
    }).id("applied_armorer:bracelet_niklas")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_aerial_wristband"}'),
        "createdelight:phase_transition_iron",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "#forge:ingots/electrum"
    ).id("applied_armorer:bracelet_aerial_wristband")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_double_sided_mirror"}'), [
        "A A",
        "BCB"
    ], {
        A: "ae2:quartz_glass",
        B: "megacells:sky_steel_ingot",
        C: "ae2:fluix_crystal"
    })
        .id("applied_armorer:si_double_sided_mirror")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_profession"}'), [
        "A  ",
        "BBB"
    ], {
        A: "ae2:quartz_glass",
        B: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:si_profession")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:scope_xgs_905"}'), [
        "AAA",
        "B B",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass"
    })
        .id("applied_armorer:scope_xgs_905")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_simple_3"}'), [
        " A ",
        " B ",
        " A "
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass"
    })
        .id("applied_armorer:si_simple_3")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:sight_type_3741"}'), [
        "ABA",
    ], {
        A: "megacells:sky_steel_ingot",
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_simple_3"}').strongNBT()
    })
        .id("applied_armorer:sight_type_3741")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_ms_12"}'), [
        " A ",
        "BCB",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:sight_type_3741"}').strongNBT()
    })
        .id("applied_armorer:scope_ms_12")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:scope_ms_14"}'), [
        "AAA",
        "BCB",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_ms_12"}').strongNBT()
    })
        .id("applied_armorer:scope_ms_14")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_ns_1"}'), [
        "AAA",
        "B B",
        "AAA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    })
        .id("applied_armorer:muzzle_ns_1")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_classic"}'), [
        " A ",
        " B ",
        " A "
    ], {
        A: "megacells:sky_steel_ingot",
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_ns_1"}').strongNBT()
    })
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bayonet_gladius"}'), [
        " A",
        " B"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "#forge:rods/iron"
    })
        .id("applied_armorer:bayonet_gladius")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bayonet_er"}'), [
        " A ",
        " A ",
        " B "
    ], {
        A: "megacells:sky_steel_ingot",
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bayonet_gladius"}').strongNBT()
    })
        .id("applied_armorer:bayonet_er")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_zenith"}'), [
        "ABC",
        "DED",
        "FGH"
    ], {
        A: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_broken_handcuffs"}').strongNBT(),
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_aerial_wristband"}').strongNBT(),
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_broken_watch"}').strongNBT(),
        D: "ae2:quantum_entangled_singularity",
        E: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        F: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_koeis_armband"}').strongNBT(),
        G: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_magma_wristband"}').strongNBT(),
        H: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_exo"}').strongNBT()
    })
        .id("applied_armorer:bracelet_zenith")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_eazy"}'), [
        "   ",
        "AAA",
        "   "
    ], {
        A: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:grip_eazy")
    kubejs.shapeless(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_lf11"}'), [
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_eazy"}').strongNBT(),
        "vintageimprovements:laser_item"
    ])
        .id("applied_armorer:grip_lf11")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_static_1"}'), [
        "AAA",
        "BCB",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:fluix_crystal",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_eazy"}').strongNBT()
    })
        .id("applied_armorer:grip_static_1")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_storm"}'), [
        "AAA",
        "BCB",
        " A "
    ], {
        A: "#forge:ingots/iron",
        B: "ae2:fluix_crystal",
        C: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:grip_storm")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_hf_17"}'), [
        "A A",
        "BCD",
        "   "
    ], {
        A: "#forge:ingots/iron",
        B: "#forge:gems/certus_quartz",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_eazy"}').strongNBT(),
        D: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:grip_hf_17")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_light"}'), [
        " A ",
        " B ",
        " B "
    ], {
        A: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_hf_17"}').strongNBT(),
        B: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:grip_light")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_stable"}'), [
        "   ",
        "BAB",
        "BBB"
    ], {
        A: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_eazy"}').strongNBT(),
        B: "megacells:sky_steel_ingot"
    })
        .id("applied_armorer:grip_stable")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_1"}'), [
        "ABA",
        "A A",
        "ACA"
    ], {
        A: "#forge:gems/quartz",
        B: "#forge:storage_blocks/quartz",
        C: "ae2:cell_component_1k"
    })
        .id("applied_armorer:extended_mag_aa_1")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_2"}'), [
        "ABA",
        "ACA",
        "ADA"
    ], {
        A: "#forge:gems/certus_quartz",
        B: "#forge:storage_blocks/certus_quartz",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_1"}').strongNBT(),
        D: "ae2:cell_component_4k"
    })
        .id("applied_armorer:extended_mag_aa_2")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_3"}'), [
        "ABA",
        "ACA",
        "ADA"
    ], {
        A: "#forge:gems/fluix",
        B: "ae2:fluix_block",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_2"}').strongNBT(),
        D: "ae2:cell_component_16k"
    })
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_battery_aa_1"}'), [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "#forge:gems/fluix",
        B: "ae2:energy_cell",
        C: "megacells:accumulation_processor"
    })
        .id("applied_armorer:extended_battery_aa_1")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_battery_aa_2"}'), [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "ae2:energy_card",
        B: "ae2:dense_energy_cell",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_battery_aa_1"}').strongNBT()
    })
        .id("applied_armorer:extended_battery_aa_2")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_battery_aa_3"}'), [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "megacells:greater_energy_card",
        B: "megacells:mega_energy_cell",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_battery_aa_2"}').strongNBT()
    })
        .id("applied_armorer:extended_battery_aa_3")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_commander"}'), [
        "AAA",
        "   ",
        "BAA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    }).id("applied_armorer:muzzle_commander")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_bs_mod4"}'), [
        "ABA",
        "   ",
        "ABA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    }).id("applied_armorer:muzzle_bs_mod4")
    kubejs.shaped(Item.of('tacz:ammo', 20, '{AmmoId:"applied_armorer:fluix_battery"}'), [
        "ABA",
        "ACA",
        "AAA"
    ], {
        A: "#forge:storage_blocks/sky_steel",
        B: "ae2:fluix_block",
        C: Item.of('megacells:mega_energy_cell', { internalCurrentPower: 12800000 }).weakNBT()
    }).id("applied_armorer:fluix_battery")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_sl_2"}'), [
        "   ",
        "ABA",
        "   "
    ], {
        A: "ae2:charged_certus_quartz_crystal",
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:grip_lf11"}').strongNBT()
    }).id("applied_armorer:grip_sl_2")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mid_mag_aa_1"}'),
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_1"}').strongNBT(),
        "#forge:dusts/ender_pearl",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_1"}').strongNBT()
    )
        .id("applied_armorer:extended_mid_mag_aa_1")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mid_mag_aa_2"}'),
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_2"}').strongNBT(),
        "#forge:dusts/ender_pearl",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_2"}').strongNBT()
    )
        .id("applied_armorer:extended_mid_mag_aa_2")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mid_mag_aa_3"}'),
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_3"}').strongNBT(),
        "#forge:dusts/ender_pearl",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:extended_mag_aa_3"}').strongNBT()
    )
        .id("applied_armorer:extended_mid_mag_aa_3")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_broken_handcuffs"}'),
        "minecraft:chain",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "minecraft:pink_dye"
    ).id("applied_armorer:bracelet_broken_handcuffs")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_broken_watch"}'),
        "createdieselgenerators:distillation_controller",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        null
    ).id("applied_armorer:bracelet_broken_watch")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_koeis_armband"}'),
        "art_of_forging:life_fiber",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "alexscaves:dark_tatters"
    ).id("applied_armorer:bracelet_koeis_armband")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_magma_wristband"}'),
        "alexscaves:tectonic_shard",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "minecraft:magma_block"
    ).id("applied_armorer:bracelet_magma_wristband")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_exo"}'),
        "createdelight:forged_steel_sheet",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "ae2:singularity"
    ).id("applied_armorer:bracelet_exo")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firefly"}'),
        "ae2:calculation_processor",
        "#forge:plates/iron",
        "ae2:logic_processor"
    ).id("applied_armorer:muzzle_chip_firefly")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_pcs_x1"}'),
        "ae2:speed_card",
        "createdelight:forged_steel_sheet",
        "ae2:calculation_processor"
    ).id("applied_armorer:muzzle_chip_pcs_x1")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_atm_x2"}'),
        "ae2:speed_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_pcs_x1"}').strongNBT(),
        "ae2:engineering_processor"
    ).id("applied_armorer:muzzle_chip_atm_x2")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firework"}'),
        "ae2:energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firefly"}').strongNBT(),
        "ae2:energy_cell"
    ).id("applied_armorer:muzzle_chip_firework")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_hyper_propellant"}'),
        "ae2:energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firework"}').strongNBT(),
        "ae2:dense_energy_cell"
    ).id("applied_armorer:muzzle_chip_hyper_propellant")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_fat_boy"}'),
        "megacells:greater_energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_hyper_propellant"}').strongNBT(),
        "megacells:mega_energy_cell"
    ).id("applied_armorer:muzzle_chip_fat_boy")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_pistol_semi_pride",HasBulletInBarrel:0b}'),
        "ae2:annihilation_core",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_pistol_semi_union"}').weakNBT(),
        "ae2:basic_card"
    ).id("applied_armorer:niklas_pistol_semi_pride")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_pistol_semi_right",HasBulletInBarrel:0b}'),
        "ae2:annihilation_core",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_pistol_semi_pride"}').weakNBT(),
        "ae2:advanced_card"
    ).id("applied_armorer:niklas_pistol_semi_right")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_pistol_double_win_win",HasBulletInBarrel:1b}'),
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_pistol_semi_union"}').weakNBT(),
        "ae2:singularity",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_pistol_semi_union"}').weakNBT(),
    ).id("applied_armorer:niklas_pistol_double_win_win")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:moritz_rifle_ar77",HasBulletInBarrel:0b}'),
        "ae2:annihilation_core",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_smg_freedom"}').weakNBT(),
        "ae2:basic_card"
    ).id("applied_armorer:moritz_rifle_ar77")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_lever_vigenere",HasBulletInBarrel:0b}'),
        "ae2:annihilation_core",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_rifle_ar77"}').weakNBT(),
        "ae2:energy_card"
    ).id("applied_armorer:niklas_lever_vigenere")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:moritz_shotgun_sg914",HasBulletInBarrel:0b}'),
        "ae2:annihilation_core",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_rifle_ar77"}').weakNBT(),
        "ae2:speed_card"
    ).id("applied_armorer:moritz_shotgun_sg914")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:moritz_sniper_semi_k30",HasBulletInBarrel:0b}'),
        "ae2:speed_card",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_lever_vigenere"}').weakNBT(),
        "megacells:greater_energy_card"
    ).id("applied_armorer:moritz_sniper_semi_k30")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:moritz_mg_hmg22",HasBulletInBarrel:0b}'),
        "ae2:speed_card",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_smg_freedom"}').weakNBT(),
        "ae2:energy_card"
    ).id("applied_armorer:moritz_mg_hmg22")
    custom_inscribe(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:moritz_gernade_gl3",HasBulletInBarrel:0b}'),
        "megacells:compression_card",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:niklas_lever_vigenere"}').weakNBT(),
        "ae2:energy_card"
    ).id("applied_armorer:moritz_gernade_gl3")


    transform_fluid(Item.of('tacz:ammo', '{AmmoId:"applied_armorer:cluster_quartz_bullet"}'), "createdelight:spent_liquor", [
        "#forge:dusts/ender_pearl",
        "#forge:dusts/certus_quartz",
        Item.of('tacz:ammo', '{AmmoId:"tacz:12g"}').strongNBT()
    ]).id("applied_armorer:cluster_quartz_bullet")
    transform_fluid(Item.of('tacz:ammo', '{AmmoId:"applied_armorer:hard_core_quartz_bullet"}'), "createdelight:spent_liquor", [
        "#forge:dusts/ender_pearl",
        "#forge:dusts/certus_quartz",
        Item.of('tacz:ammo', '{AmmoId:"create_armorer:slap"}').strongNBT()
    ]).id("applied_armorer:hard_core_quartz_bullet")
    transform_fluid(Item.of('tacz:ammo', '{AmmoId:"applied_armorer:etched_quartz_bullet"}'), "createdelight:spent_liquor", [
        "#forge:dusts/ender_pearl",
        "#forge:dusts/certus_quartz",
        Item.of('tacz:ammo', '{AmmoId:"create_armorer:rbapb"}').strongNBT()
    ]).id("applied_armorer:etched_quartz_bullet")
    transform_fluid(Item.of('tacz:ammo', '{AmmoId:"applied_armorer:fluix_infused_grenade"}'), "createdelight:spent_liquor", [
        "#forge:dusts/ender_pearl",
        "#forge:dusts/certus_quartz",
        Item.of("protection_pixel:pneumaticgrenade")
    ]).id("applied_armorer:fluix_infused_grenade")
    transform_fluid(Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_pistol_semi_union",HasBulletInBarrel:0b}'), "createdelight:spent_liquor", [
        "#forge:storage_blocks/sky_steel",
        "#forge:storage_blocks/iron",
        "ae2:singularity",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"create_armorer:pistol_auto_stress"}').weakNBT()
    ]).id("applied_armorer:niklas_pistol_semi_union")
    transform_fluid(Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"applied_armorer:niklas_smg_freedom",HasBulletInBarrel:0b}'), "createdelight:spent_liquor", [
        "#forge:storage_blocks/sky_steel",
        "#forge:storage_blocks/iron",
        "ae2:singularity",
        Item.of('tacz:modern_kinetic_gun', '{GunId:"create_armorer:smg_auto_crank"}').weakNBT()
    ]).id("applied_armorer:smg_auto_crank")
    transform_explosion(Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"applied_armorer:moritz_mg_emg_prototype",HasBulletInBarrel:0b}'), [
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_mg_hmg22"}').weakNBT(),
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_mg_hmg22"}').weakNBT(),
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_mg_hmg22"}').weakNBT(),
        Item.of('tacz:modern_kinetic_gun', '{GunId:"applied_armorer:moritz_mg_hmg22"}').weakNBT(),
        "ae2:quantum_link"
    ]).id("applied_armorer:moritz_mg_emg_prototype")
})