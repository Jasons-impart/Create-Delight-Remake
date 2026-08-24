// 通用机械融合的注册物（P1）：序列组装过渡物（create:sequenced_assembly 类型，JEI 不显示）
// 机器 16 项 + 升级模块 7 项，与 machine_assembly.js / upgrades.js 的链条一一对应

StartupEvents.registry("item", e => {
    const machines = [
        "crusher", "enrichment_chamber", "energized_smelter",
        "purification_chamber", "chemical_injection_chamber",
        "metallurgic_infuser", "electrolytic_separator",
        "chemical_dissolution_chamber", "chemical_washer", "chemical_crystallizer",
        "chemical_oxidizer", "pressurized_reaction_chamber", "isotopic_centrifuge",
        "formulaic_assemblicator", "configurator", "robit"
    ]
    for (const name of machines) {
        e.create(`createdelight:incomplete_${name}`, "create:sequenced_assembly")
            .translationKey(`item.createdelight.incomplete_${name}`)
    }

    const upgrades = ["speed", "energy", "gas", "filter", "muffling", "anchor", "stone_generator"]
    for (const name of upgrades) {
        e.create(`createdelight:incomplete_upgrade_${name}`, "create:sequenced_assembly")
            .translationKey(`item.createdelight.incomplete_upgrade_${name}`)
    }
})
