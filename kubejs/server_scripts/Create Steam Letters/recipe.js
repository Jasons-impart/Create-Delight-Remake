ServerEvents.recipes(e => {
    if (!Platform.isLoaded("steam_letters")) return

    const { create, steam_letters } = e.recipes

    remove_recipes_id(e, [
        "steam_letters:pressing/material/bronze/plate",
        "steam_letters:crafting/shapeless/material/tin_ingot_block",
        "steam_letters:crafting/shaped/material/tin_ingot_nugget",
        "steam_letters:mixing/material/bronze/ingot",
        "steam_letters:crushing/material/tin/nugget/deepslate",
        "steam_letters:milling/material/tin/nugget/deepslate",
        "steam_letters:crafting/shaped/material/bronze_block_ingot",
        "steam_letters:crafting/shapeless/material/tin_nugget_ingot",
        "steam_letters:crafting/shapeless/material/bronze_ingot_block",
        "steam_letters:crafting/shaped/material/tin_block_ingot",
        "steam_letters:crafting/shaped/steam/boiler",
        "steam_letters:crafting/shaped/bronze/basin/ingot",
        "steam_letters:crafting/shaped/bronze/basin/ingot_update",
        "steam_letters:crafting/shaped/flywheel",
        "steam_letters:solid_fuel/blaze_rod",
        "steam_letters:solid_fuel/compat/coal_coke",
        "steam_letters:solid_fuel/compat/coal_coke_block",
        "steam_letters:solid_fuel/diamond",
        "steam_letters:solid_fuel/diamond_block",
        "steam_letters:fluid_fuel/lava",
        "steam_letters:fluid_fuel/compat/biodiesel",
        "steam_letters:fluid_fuel/compat/crude_oil",
        "steam_letters:fluid_fuel/compat/diesel",
        "steam_letters:fluid_fuel/compat/ethanol",
        "steam_letters:fluid_fuel/compat/gasoline",
        "steam_letters:fluid_fuel/compat/plantoil"
    ])

    create.filling(
        "steam_letters:bronze_boiler",
        [
            "create:fluid_tank",
            Fluid.of("createmetallurgy:molten_bronze", 270)
        ]
    ).id("createdelight:bronze_boiler")

    const solidFuels = [
        ["minecraft:blaze_rod", 2400, false],
        // 9 个干海带压成一块，时长参考 9 块木板，每块 300 tick。
        ["minecraft:dried_kelp_block", 2700, false],
        // 一块焦炭块由 9 个焦炭合成，本包熔炉配置为 18000 tick / 块。
        ["createmetallurgy:coke", 2000, false],
        ["createmetallurgy:coke_block", 18000, false],
        // 压块配方用 1000 mB 动物油，注液配方用 50 mB 混合燃料。
        ["northeast_china_delight:animal_oil_block", 5000, false],
        ["createdelight:fuel_hotcream", 3000, true]
    ]
    solidFuels.forEach(fuel => {
        const [item, burnTime, superheated] = fuel
        if (!Item.exists(item)) return
        const name = item.split(":")[1]
        steam_letters.solid_fuel(item, burnTime, superheated)
            .id(`createdelight:steam_letters/solid_fuel/${name}`)
    })
    steam_letters.solid_fuel("#forge:gems/diamond", 1200, true)
        .id("createdelight:steam_letters/solid_fuel/diamond")
    steam_letters.solid_fuel("#forge:storage_blocks/diamond", 10800, true)
        .id("createdelight:steam_letters/solid_fuel/diamond_block")

    // 流体、每桶时长（tick）、是否超级燃烧、可作为固体燃料的桶。
    // 时长取自 Create Liquid Fuel 的熔岩默认值及本包 kubejs/data/*/blaze_burner_fuel/。
    const fluidFuels = [
        ["#minecraft:lava", 20000, false, "minecraft:lava_bucket"],
        ["createdelight:cryo_fuel", 30000, true, "createdelight:cryo_fuel_bucket"],
        ["createdelight:ethylene_fluid", 30000, false, "createdelight:ethylene_fluid_bucket"],
        ["createdelight:fuel_mixtures", 60000, true, "createdelight:fuel_mixtures_bucket"],
        ["createdelight:lubricating_oil", 10000, false, "createdelight:lubricating_oil_bucket"],
        ["createdieselgenerators:biodiesel", 20000, true, "createdieselgenerators:biodiesel_bucket"],
        ["createdieselgenerators:crude_oil", 10000, false, "createdieselgenerators:crude_oil_bucket"],
        ["createdieselgenerators:diesel", 40000, true, "createdieselgenerators:diesel_bucket"],
        ["createdieselgenerators:ethanol", 40000, false, "createdieselgenerators:ethanol_bucket"],
        ["createdieselgenerators:gasoline", 40000, true, "createdieselgenerators:gasoline_bucket"],
        ["createdieselgenerators:plant_oil", 5000, false, "createdieselgenerators:plant_oil_bucket"],
        ["northeast_china_delight:animal_oil", 5000, false],
        ["northeast_china_delight:chili_oil", 5000, false]
    ]

    fluidFuels.forEach(fuel => {
        const [fluid, burnTime, superheated, bucket] = fuel
        if (!fluid.startsWith("#") && !Fluid.exists(fluid)) return
        const name = fluid.split(":")[1]
        steam_letters.fluid_fuel(fluid, burnTime, superheated)
            .id(`createdelight:steam_letters/fluid_fuel/${name}`)

        if (bucket && Item.exists(bucket)) {
            steam_letters.solid_fuel(bucket, burnTime, superheated)
                .id(`createdelight:steam_letters/solid_fuel/${name}_bucket`)
        }
    })
})

ServerEvents.tags("item", e => {
    if (!Platform.isLoaded("steam_letters")) return
    e.remove("steam_letters:superheated_fuel", "#forge:storage_blocks/coal_coke")
})

ServerEvents.highPriorityData(e => {
    if (!Platform.isLoaded("steam_letters") || !Platform.isLoaded("northeast_china_delight")) return

    // 植物油瓶、动物油瓶和辣椒油瓶的对应流体均为 5 tick/mB，Damage 为已用的 mB。
    // 用原生配方 JSON 保留 Damage 条件，Steam Letters 的 KubeJS 原料写入器只保留物品或标签。
    const oilBottles = ["cooking_oil", "animal_oil", "chili_oil"]
    oilBottles.forEach(name => {
        for (let usedMb = 0; usedMb <= 250; usedMb++) {
            e.addJson(`createdelight:recipes/steam_letters/solid_fuel/${name}_bottle/damage_${usedMb}.json`, {
                type: "steam_letters:solid_fuel",
                ingredients: [{
                    type: "forge:partial_nbt",
                    item: `northeast_china_delight:${name}`,
                    nbt: `{Damage:${usedMb}}`
                }],
                processingTime: (250 - usedMb) * 5,
                results: []
            })
        }
    })
})
