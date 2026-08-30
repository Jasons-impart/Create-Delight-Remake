ServerEvents.recipes(e => {
    const { create, minecraft } = e.recipes

    const C = {
        andesite: "createdelight:andesite_structure_component",
        copper: "createdelight:copper_fluid_component",
        brass: "createdelight:brass_control_component",
        transmission: "createdelight:kinetic_transmission_component",
        sealed: "createdelight:sealed_joint_component",
        logic: "createdelight:logic_component"
    }

    const readTomlBool = (key, fallback) => {
        try {
            const Files = Java.loadClass("java.nio.file.Files")
            const Paths = Java.loadClass("java.nio.file.Paths")
            const lines = Files.readAllLines(Paths.get("config/fluidlogistics-common.toml"))
            for (let i = 0; i < lines.size(); i++) {
                const line = String(lines.get(i)).trim()
                if (line.startsWith(`${key} =`)) {
                    return line.split("=")[1].trim() == "true"
                }
            }
        } catch (ignored) {
        }
        return fallback
    }

    const FL = {
        fluidPump: readTomlBool("fluidPumpEnabled", true),
        faucet: readTomlBool("faucetEnabled", true),
        smartFaucet: readTomlBool("smartFaucetEnabled", true),
        smartHopper: readTomlBool("smartHopperEnabled", true),
        mechanicalFluidGun: readTomlBool("mechanicalFluidGunEnabled", true),
        fluidTransporter: readTomlBool("fluidTransporterEnabled", true),
        multiFluidAccessPort: readTomlBool("multiFluidAccessPortEnabled", true),
        multiFluidTank: readTomlBool("multiFluidTankEnabled", true),
        horizontalMultiFluidTank: readTomlBool("horizontalMultiFluidTankEnabled", true),
        advancedLogisticsNetwork: readTomlBool("advancedLogisticsNetworkEnabled", false)
    }

    const componentSmithing = (result, template, base, addition, name) => {
        minecraft.smithing_transform(`2x ${result}`, template, base, addition)
            .id(`createdelight:test/component_smithing/${name}`)
    }

    const componentAssembly = (result, start, component, addition, name) => {
        let iner = Item.of(start, `{createdelight_test_machine:"${name}"}`)
        create.sequenced_assembly(result, start, [
            create.deploying(iner, [iner, addition]),
            create.deploying(iner, [iner, component]),
            create.pressing(iner, iner)
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:test/component_assembly/${name}`)
    }

    const componentMachine = (enabled, result, assemblyResult, template, base, addition, name) => {
        if (!enabled) return
        componentSmithing(result, template, base, addition, name)
        componentAssembly(assemblyResult || result, template, base, addition, name)
    }

    // Component sources: shapeless recipes also receive auto-generated mixing routes.
    e.recipes.kubejs.shapeless(`2x ${C.andesite}`, [
        "create:andesite_alloy",
        "create:shaft",
        "#forge:spring/between_500_2_1000",
        "#minecraft:planks"
    ]).id("createdelight:test/component/andesite_structure")

    e.recipes.kubejs.shapeless(`2x ${C.copper}`, [
        "#forge:ingots/copper",
        "#forge:spring/below_500",
        "minecraft:dried_kelp",
        "#forge:ingots/iron"
    ]).id("createdelight:test/component/copper_fluid")

    e.recipes.kubejs.shapeless(`2x ${C.brass}`, [
        "#forge:ingots/brass",
        "#forge:ingots/brass",
        "create:electron_tube",
        "#forge:nuggets/gold"
    ]).id("createdelight:test/component/brass_control")

    e.recipes.kubejs.shapeless(`2x ${C.transmission}`, [
        "create:shaft",
        "create:cogwheel",
        "create:andesite_alloy",
        "#forge:ingots/iron"
    ]).id("createdelight:test/component/kinetic_transmission")

    e.recipes.kubejs.shapeless(`2x ${C.sealed}`, [
        "#forge:ingots/copper",
        "#forge:ingots/copper",
        "minecraft:dried_kelp",
        "minecraft:slime_ball"
    ]).id("createdelight:test/component/sealed_joint")

    e.recipes.kubejs.shapeless(`2x ${C.logic}`, [
        "#forge:ingots/iron",
        "minecraft:redstone",
        "minecraft:paper",
        "create:transmitter"
    ]).id("createdelight:test/component/logic")

    // Batch routes for small attachments: components improve throughput, not the base recipe identity.
    // Engine disassembly stays within the engine's own component family.
    
    minecraft.stonecutting(`8x ${C.andesite}`, "create_sa:heat_engine")
        .id("createdelight:test/component/andesite_structure_from_heat_engine")
    minecraft.stonecutting(`8x ${C.copper}`, "create_sa:hydraulic_engine")
        .id("createdelight:test/component/copper_fluid_from_hydraulic_engine")
    minecraft.stonecutting(`8x ${C.sealed}`, "create_sa:hydraulic_engine")
        .id("createdelight:test/component/sealed_joint_from_hydraulic_engine")
    minecraft.stonecutting(`8x ${C.brass}`, "create_sa:steam_engine")
        .id("createdelight:test/component/brass_control_from_steam_engine")
    minecraft.stonecutting(`4x ${C.transmission}`, "create_sa:heat_engine")
        .id("createdelight:test/component/kinetic_transmission_from_heat_engine")
    minecraft.stonecutting(`8x ${C.transmission}`, "create_sa:steam_engine")
        .id("createdelight:test/component/kinetic_transmission_from_steam_engine")


    // Smithing table route: two components plus the machine-defining part.
    componentSmithing("create:mechanical_press", C.andesite, C.transmission, "minecraft:iron_block", "mechanical_press")
    componentSmithing("create:mechanical_mixer", C.andesite, C.transmission, "create:whisk", "mechanical_mixer")
    componentSmithing("create:encased_fan", C.andesite, C.transmission, "create:propeller", "encased_fan")
    componentSmithing("create:mechanical_drill", C.andesite, C.transmission, "createoreexcavation:drill", "mechanical_drill")
    componentSmithing("create:mechanical_saw", C.andesite, C.transmission, "create:iron_sheet", "mechanical_saw")
    componentSmithing("create:mechanical_harvester", C.andesite, C.transmission, "minecraft:iron_hoe", "mechanical_harvester")
    componentSmithing("create:mechanical_roller", C.andesite, C.transmission, "create:crushing_wheel", "mechanical_roller")

    componentSmithing("create:item_drain", C.copper, C.sealed, "minecraft:iron_bars", "item_drain")
    componentSmithing("create:spout", C.copper, C.sealed, "minecraft:dried_kelp", "spout")
    componentSmithing("create:portable_fluid_interface", C.copper, C.sealed, "create:chute", "portable_fluid_interface")
    componentSmithing("create:portable_storage_interface", C.andesite, C.sealed, "create:chute", "portable_storage_interface")

    componentSmithing("create:deployer", C.andesite, C.transmission, "create:brass_hand", "deployer")
    componentSmithing("create:mechanical_arm", C.brass, C.andesite, "create:precision_mechanism", "mechanical_arm")
    componentSmithing("create:rotation_speed_controller", C.brass, C.transmission, "create:precision_mechanism", "rotation_speed_controller")
    componentSmithing("create:mechanical_crafter", C.brass, C.andesite, "minecraft:crafting_table", "mechanical_crafter")

    componentSmithing("create:package_frogport", C.logic, C.andesite, "create:item_vault", "package_frogport")
    componentSmithing("create:packager", C.logic, C.andesite, "create:cardboard_block", "packager")
    componentSmithing("create:stock_link", C.logic, C.brass, "create:transmitter", "stock_link")
    componentSmithing("create:redstone_requester", C.logic, "create:stock_link", "minecraft:redstone", "redstone_requester")
    componentSmithing("create:stock_ticker", C.logic, "create:stock_link", "#forge:glass", "stock_ticker")
    componentSmithing("create:white_postbox", C.logic, C.andesite, "minecraft:barrel", "white_postbox")

    componentSmithing("vintageimprovements:spring_coiling_machine", C.andesite, C.transmission, "vintageimprovements:spring_coiling_machine_wheel", "spring_coiling_machine")
    componentSmithing("createmetallurgy:mechanical_belt_grinder", C.andesite, C.transmission, "createmetallurgy:sandpaper_belt", "mechanical_belt_grinder")
    componentSmithing("vintageimprovements:vibrating_table", C.andesite, C.transmission, "create:mechanical_piston", "vibrating_table")
    componentSmithing("vintageimprovements:curving_press", C.andesite, C.transmission, "vintageimprovements:andesite_sheet", "curving_press")
    componentSmithing("vintageimprovements:vacuum_chamber", C.copper, C.sealed, "create:mechanical_pump", "vacuum_chamber")
    componentSmithing("vintageimprovements:centrifuge", C.andesite, C.transmission, "#minecraft:logs", "centrifuge")
    componentSmithing("createmetallurgy:foundry_mixer", C.copper, C.transmission, "createmetallurgy:sturdy_whisk", "foundry_mixer")
    componentSmithing("ratatouille:thresher", C.andesite, C.transmission, "create:mechanical_harvester", "thresher")
    componentSmithing("ratatouille:mechanical_demolder", C.andesite, C.sealed, "minecraft:slime_ball", "mechanical_demolder")

    // Sequenced assembly route: same ingredients, better output for automation.
    componentAssembly("2x create:mechanical_press", C.andesite, C.transmission, "minecraft:iron_block", "mechanical_press")
    componentAssembly("2x create:mechanical_mixer", C.andesite, C.transmission, "create:whisk", "mechanical_mixer")
    componentAssembly("2x create:encased_fan", C.andesite, C.transmission, "create:propeller", "encased_fan")
    componentAssembly("2x create:mechanical_drill", C.andesite, C.transmission, "createoreexcavation:drill", "mechanical_drill")
    componentAssembly("2x create:mechanical_saw", C.andesite, C.transmission, "create:iron_sheet", "mechanical_saw")
    componentAssembly("2x create:mechanical_harvester", C.andesite, C.transmission, "minecraft:iron_hoe", "mechanical_harvester")
    componentAssembly("2x create:mechanical_roller", C.andesite, C.transmission, "create:crushing_wheel", "mechanical_roller")

    componentAssembly("2x create:item_drain", C.copper, C.sealed, "minecraft:iron_bars", "item_drain")
    componentAssembly("2x create:spout", C.copper, C.sealed, "create:nozzle", "spout")
    componentAssembly("2x create:portable_fluid_interface", C.copper, C.sealed, "create:fluid_pipe", "portable_fluid_interface")
    componentAssembly("2x create:portable_storage_interface", C.andesite, C.sealed, "create:chute", "portable_storage_interface")

    componentAssembly("2x create:deployer", C.andesite, C.transmission, "create:brass_hand", "deployer")
    componentAssembly("create:mechanical_arm", C.brass, C.andesite, "create:precision_mechanism", "mechanical_arm")
    componentAssembly("create:rotation_speed_controller", C.brass, C.transmission, "create:precision_mechanism", "rotation_speed_controller")
    componentAssembly("2x create:mechanical_crafter", C.brass, C.andesite, "minecraft:crafting_table", "mechanical_crafter")

    componentAssembly("2x create:package_frogport", C.logic, C.andesite, "create:item_vault", "package_frogport")
    componentAssembly("2x create:packager", C.logic, C.andesite, "create:cardboard_block", "packager")
    componentAssembly("2x create:stock_link", C.logic, C.brass, "create:transmitter", "stock_link")
    componentAssembly("2x create:redstone_requester", C.logic, "create:stock_link", "minecraft:redstone", "redstone_requester")
    componentAssembly("2x create:stock_ticker", C.logic, "create:stock_link", "#forge:glass", "stock_ticker")
    componentAssembly("2x create:white_postbox", C.logic, C.andesite, "minecraft:barrel", "white_postbox")

    componentAssembly("2x vintageimprovements:spring_coiling_machine", C.andesite, C.transmission, "vintageimprovements:spring_coiling_machine_wheel", "spring_coiling_machine")
    componentAssembly("2x createmetallurgy:mechanical_belt_grinder", C.andesite, C.transmission, "createmetallurgy:sandpaper_belt", "mechanical_belt_grinder")
    componentAssembly("2x vintageimprovements:vibrating_table", C.andesite, C.transmission, "create:mechanical_piston", "vibrating_table")
    componentAssembly("2x vintageimprovements:curving_press", C.andesite, C.transmission, "vintageimprovements:andesite_sheet", "curving_press")
    componentAssembly("vintageimprovements:vacuum_chamber", C.copper, C.sealed, "create:mechanical_pump", "vacuum_chamber")
    componentAssembly("vintageimprovements:centrifuge", C.andesite, C.transmission, "#minecraft:logs", "centrifuge")
    componentAssembly("2x createmetallurgy:foundry_mixer", C.copper, C.transmission, "createmetallurgy:sturdy_whisk", "foundry_mixer")
    componentAssembly("2x ratatouille:thresher", C.andesite, C.transmission, "create:mechanical_harvester", "thresher")
    componentAssembly("2x ratatouille:mechanical_demolder", C.andesite, C.sealed, "minecraft:slime_ball", "mechanical_demolder")

    componentMachine(FL.faucet, "fluidlogistics:faucet", "2x fluidlogistics:faucet", C.copper, C.sealed, "create:copper_valve_handle", "faucet")
    componentMachine(FL.fluidPump, "fluidlogistics:fluid_pump", "2x fluidlogistics:fluid_pump", C.copper, C.transmission, "create:fluid_pipe", "fluid_pump")
    componentMachine(FL.smartFaucet && FL.faucet, "fluidlogistics:smart_faucet", null, C.copper, C.brass, "fluidlogistics:faucet", "smart_faucet")
    componentMachine(FL.smartHopper, "fluidlogistics:smart_hopper", null, C.copper, C.brass, "create:item_vault", "smart_hopper")
    componentMachine(FL.mechanicalFluidGun, "fluidlogistics:mechanical_fluid_gun", null, C.copper, C.transmission, "create_sa:hydraulic_engine", "mechanical_fluid_gun")
    componentMachine(FL.fluidTransporter, "fluidlogistics:fluid_transporter", null, C.copper, C.brass, "create_sa:hydraulic_engine", "fluid_transporter")
    componentMachine(FL.multiFluidAccessPort && FL.multiFluidTank, "fluidlogistics:multi_fluid_access_port", null, C.copper, C.brass, "fluidlogistics:multi_fluid_tank", "multi_fluid_access_port")
    componentMachine(FL.multiFluidAccessPort && FL.horizontalMultiFluidTank, "fluidlogistics:multi_fluid_access_port", null, C.copper, C.brass, "fluidlogistics:horizontal_multi_fluid_tank", "multi_fluid_access_port_h")
    componentMachine(FL.advancedLogisticsNetwork, "fluidlogistics:fluid_packager", null, C.copper, C.brass, "fluidlogistics:waterproof_cardboard_block", "fluid_packager")

    componentMachine(true, "create_fantasizing:transporter", "3x create_fantasizing:transporter", C.brass, C.transmission, "create_sa:heat_engine", "transporter")
})
