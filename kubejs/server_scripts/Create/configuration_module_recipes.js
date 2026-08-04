ServerEvents.recipes(event => {
    const { minecraft } = event.recipes

    const moduleStack = (item, mode, target, charge, chargeCost) => Item.of(item, {
        Mode: mode,
        Target: target,
        Charge: charge,
        ChargeCost: chargeCost,
        MaxCharge: 64,
        Tier: 0,
        DataVersion: 1
    })

    minecraft.smithing_transform(
        moduleStack("createdelightcore:kinetic_configuration_module", "createdelightcore:shaft", "create:shaft", 4, 1),
        "createdelight:kinetic_transmission_component",
        "create:andesite_casing",
        "create:electron_tube"
    ).id("createdelight:smithing_transform/kinetic_configuration_module")

    minecraft.smithing_transform(
        moduleStack("createdelightcore:structural_configuration_module", "createdelightcore:andesite_casing", "create:andesite_casing", 4, 2),
        "createdelight:andesite_structure_component",
        "create:andesite_casing",
        "create:super_glue"
    ).id("createdelight:smithing_transform/structural_configuration_module")

    minecraft.smithing_transform(
        moduleStack("createdelightcore:fluid_configuration_module", "createdelightcore:fluid_pipe", "create:fluid_pipe", 8, 1),
        "createdelight:copper_fluid_component",
        "create:copper_casing",
        "createdelight:sealed_joint_component"
    ).id("createdelight:smithing_transform/fluid_configuration_module")

    minecraft.smithing_transform(
        moduleStack("createdelightcore:control_configuration_module", "createdelightcore:redstone_link", "create:redstone_link", 4, 4),
        "createdelight:brass_control_component",
        "create:brass_casing",
        "create:precision_mechanism"
    ).id("createdelight:smithing_transform/control_configuration_module")

    minecraft.smithing_transform(
        moduleStack("createdelightcore:logistics_configuration_module", "createdelightcore:chute", "create:chute", 4, 1),
        "createdelight:logic_component",
        "create:brass_casing",
        "create:transmitter"
    ).id("createdelight:smithing_transform/logistics_configuration_module")
})
