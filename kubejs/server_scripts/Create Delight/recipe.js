ServerEvents.recipes(e => {
    const {vintageimprovements, kubejs, create} = e.recipes

    kubejs.shaped("createdelightcore:copper_coil", [
        "ABA",
        "BCB",
        "ABA"
    ],
    {
        A: "createaddition:copper_wire",
        B: "create:copper_sheet",
        C: "createdelightcore:steel_casing"
    })
    .id("createdelight:copper_coil")

    {
        let iner = "createdelightcore:steel_casing"
        create.sequenced_assembly("createdelightcore:copper_coil", iner, [
            create.deploying(iner, [iner, "createaddition:copper_wire"]),
            create.deploying(iner, [iner, "create:copper_sheet"])
        ])
            .loops(2)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/copper_coil_casing")
    }
})