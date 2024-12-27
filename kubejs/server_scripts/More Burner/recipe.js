ServerEvents.recipes(e => {
    const {vintageimprovements, kubejs, create} = e.recipes

    remove_recipes_id(e, [
        "moreburners:copper_coil",
        "moreburners:sequenced_assembly/heat_upgrade",
        "moreburners:resistance_coil",
        "moreburners:electric_burner"
    ])
    vintageimprovements.coiling("moreburners:copper_coil", "create:copper_sheet")
    .id("moreburners:coiling/copper_coil")
    kubejs.shaped("createdelight:coil", [
        "AAA",
        "A A",
        "AAA"
    ],
    {
        A: "moreburners:copper_coil"
    })
    .id("createdelight:coil")
    let iner_1 = "create:sturdy_sheet"
    create.sequenced_assembly("moreburners:heat_upgrade", iner_1, [
        create.deploying(iner_1, [iner_1, "moreburners:copper_coil"]),
        create.filling(iner_1, [iner_1, Fluid.of("createmetallurgy:molten_brass", 250)]),
        vintageimprovements.hammering(iner_1, iner_1)
    ])
    .loops(1)
    .transitionalItem("moreburners:incomplete_heat_upgrade")
    .id("moreburners:sequenced_assembly/heat_upgrade")
    kubejs.shaped("moreburners:electric_burner", [
        "ABA",
        "CDC",
        " E "
    ],
    {
        A: "ae2:quartz_glass",
        B: "createdelight:coil",
        C: "ad_astra:steel_plate",
        D: "create:andesite_casing",
        E: "create:empty_blaze_burner",
    }).id("moreburners:electric_burner")
})