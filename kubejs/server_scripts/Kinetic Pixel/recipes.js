ServerEvents.recipes(e => {
    remove_recipes_output(e,
        [
            'kinetic_pixel:barrel',
            'kinetic_pixel:brasscompressionsheet',
            'kinetic_pixel:andesitealloycompressionsheet',
            'kinetic_pixel:specialsteelcompressionsheet',
            'kinetic_pixel:specialsteelingot',
            'kinetic_pixel:nitropropellant']
    )
    e.replaceInput({ mod: "kinetic_pixel" }, "create:iron_sheet", "ad_astra:steel_plate")
    e.replaceInput({ mod: "kinetic_pixel" }, "minecraft:iron_nugget", "ad_astra:steel_nugget")
    e.replaceInput({ mod: "kinetic_pixel" }, "kinetic_pixel:specialsteelingot", "createmetallurgy:steel_ingot")
    e.replaceInput({ mod: "kinetic_pixel" }, "create:precision_mechanism", "vintageimprovements:steel_spring")
    e.replaceInput({ mod: "kinetic_pixel" }, "minecraft:redstone", "vintageimprovements:redstone_module")

    const { create, vintageimprovements } = e.recipes
    let iner_1 = "createmetallurgy:steel_block"
    create.sequenced_assembly("6x kinetic_pixel:barrel", iner_1, [
        create.cutting(iner_1, iner_1),
        vintageimprovements.turning(iner_1, iner_1)
    ])
        .loops(1)
        .transitionalItem(iner_1)
        .id("kinetic_pixel:barrel")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:pistol_revolver_torque",HasBulletInBarrel:1b}'),
        [
            "AAAA",
            "BBCD",
            " EFD",
            "   D"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:steam_engine",
            D: "#minecraft:logs",
            E: "kinetic_pixel:ammunitionbox",
            F: "kinetic_pixel:pistonexciter"
        })
        .id("create_armorer:pistol_revolver_torque")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:pistol_auto_stress",HasBulletInBarrel:1b}'),
        [
            "AAAA",
            "BBCD",
            "EFGD",
            "   D"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:heat_engine",
            D: "#minecraft:logs",
            E: "vintageimprovements:andesite_sheet",
            F: "kinetic_pixel:ammunitionbox",
            G: "kinetic_pixel:pistonexciter"
        })
        .id("create_armorer:pistol_auto_stress")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:sniper_semi_clockwork",HasBulletInBarrel:1b}'),
        [
            "AAAABB ",
            "CCCDEFB",
            "GGGGHI ",
            "      I"
        ],
        {
            A: "create:brass_sheet",
            B: "ad_astra:steel_plate",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "create:copper_sheet",
            H: "kinetic_pixel:strikerexciter",
            I: "#minecraft:logs"
        })
        .id("create_armorer:sniper_semi_clockwork")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:rifle_assult_crane",HasBulletInBarrel:1b}'),
        [
            "AAAAB  ",
            "CCCDEFB",
            " AAAGH ",
            "      H"
        ],
        {
            A: "create:brass_sheet",
            B: "ad_astra:steel_plate",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:rifle_assult_crane")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:shotgun_db_stone",HasBulletInBarrel:1b}'),
        [
            "AAAB  ",
            "CCDE  ",
            "CCAFG ",
            "     G"
        ],
        {
            A: "ad_astra:steel_plate",
            B: "create:brass_sheet",
            C: "kinetic_pixel:barrel",
            D: "kinetic_pixel:ammunitionbox",
            E: "create_sa:steam_engine",
            F: "kinetic_pixel:strikerexciter",
            G: "#minecraft:logs"
        })
        .id("create_armorer:shotgun_db_stone")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:mg_platemag_flywheel",HasBulletInBarrel:1b}'),
        [
            " ABBA  ",
            "CDDDEFC",
            "C  GH  ",
            "     H "
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:ammunitionbox",
            C: "ad_astra:steel_plate",
            D: "kinetic_pixel:barrel",
            E: "create_sa:steam_engine",
            F: "vintageimprovements:steel_rod",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:mg_platemag_flywheel")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"SEMI",GunId:"create_armorer:shotgun_pump_bearing",HasBulletInBarrel:0b}'),
        [
            "   AAA  ",
            "BBBBCA  ",
            "  BBDEFF"
        ],
        {
            A: "create:brass_sheet",
            B: "kinetic_pixel:barrel",
            C: "create_sa:steam_engine",
            D: "kinetic_pixel:ammunitionbox",
            E: "kinetic_pixel:strikerexciter",
            F: "#minecraft:logs"
        })
        .id("create_armorer:shotgun_pump_bearing")
    create.mechanical_crafting(
        Item.of('tacz:modern_kinetic_gun', '{GunCurrentAmmoCount:0,GunFireMode:"AUTO",GunId:"create_armorer:smg_auto_crank",HasBulletInBarrel:0b}'),
        [
            "AAAB  ",
            "CCCDEB",
            "FAGH  ",
            "    H "
        ],
        {
            A: "create:brass_sheet",
            B: "create:brass_sheet",
            C: "kinetic_pixel:barrel",
            D: "create_sa:steam_engine",
            E: "vintageimprovements:steel_rod",
            F: "kinetic_pixel:ammunitionbox",
            G: "kinetic_pixel:strikerexciter",
            H: "#minecraft:logs"
        })
        .id("create_armorer:smg_auto_crank")
})
