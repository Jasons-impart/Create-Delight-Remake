ServerEvents.tags("item", e => {
    e.add("forge:bars/chocolate", [
        "create_confectionery:bar_of_white_chocolate",
        "create_confectionery:bar_of_ruby_chocolate",
        "create_confectionery:bar_of_black_chocolate"
    ])
    e.add("supplementaries:chocolate_bars", [
        "create_confectionery:bar_of_white_chocolate",
        "create_confectionery:bar_of_ruby_chocolate",
        "create_confectionery:bar_of_black_chocolate"
    ])
})

const solidChocolateMoldDemolding = {
    "ratatouille:chocolate_mold_solid": "create:bar_of_chocolate",
    "createdelightcore:black_chocolate_mold_solid": "create_confectionery:bar_of_black_chocolate",
    "createdelightcore:white_chocolate_mold_solid": "create_confectionery:bar_of_white_chocolate",
    "createdelightcore:ruby_chocolate_mold_solid": "create_confectionery:bar_of_ruby_chocolate"
}

const chocolateMoldFilledIds = [
    "ratatouille:chocolate_mold_filled",
    "createdelightcore:black_chocolate_mold_filled",
    "createdelightcore:white_chocolate_mold_filled",
    "createdelightcore:ruby_chocolate_mold_filled"
]

const chocolateMoldSolidIds = Object.keys(solidChocolateMoldDemolding)
const $QualityFoodQuality = Java.loadClass("de.cadentem.quality_food.core.Quality")

function giveOrDrop(player, item) {
    if (!player.getInventory().add(item)) {
        player.drop(item, false)
    }
}

/**
 * 把 Quality Food 星级从源物品拷到产物；无品质时不改动。
 * @param {Internal.ItemStack} from
 * @param {Internal.ItemStack} to
 */
function copyChocolateQuality(from, to) {
    let qualityUtils = global.CDServerJavaClasses.$QualityUtils
    let quality = qualityUtils.getQuality(from)
    if (quality.level() > 0) {
        qualityUtils.applyQuality(to, quality)
    }
}

Object.entries(solidChocolateMoldDemolding).forEach(([mold, chocolate]) => {
    ItemEvents.rightClicked(mold, e => {
        const {player} = e
        if (player == null || !player.isPlayer())
            return

        let handStack = player.getItemInHand(e.hand)
        // 先读品质再 shrink：堆叠共用 NBT，shrink 后仍可从同源读取
        let qualitySource = handStack
        let amount = player.isCrouching() ? handStack.count : 1
        let chocolateStack = Item.of(chocolate, amount)
        copyChocolateQuality(qualitySource, chocolateStack)
        handStack.shrink(amount)

        giveOrDrop(player, chocolateStack)
        giveOrDrop(player, Item.of("ratatouille:chocolate_mold", amount))
        player.swing()
        e.cancel()
    })
})

// Ratatouille 冷冻方块不走 Create RecipeApplier，会用 getResultItem 换新堆叠丢掉品质。
// 在 CollectingChillness 期间把品质暂存到实体 persistentData，凝固完成后写回 solid 模具。
// 鼓风机冷冻 / 机械脱模已由 Quality Food 的 FanProcessingMixin / RecipeApplierMixin 处理。
ServerEvents.tick(e => {
    if (e.server.tickCount % 10 != 0)
        return
    let qualityUtils = global.CDServerJavaClasses.$QualityUtils
    e.server.players.forEach(player => {
        let level = player.level
        let box = player.getBoundingBox().inflate(96)
        level.getEntitiesWithin(box).forEach(entity => {
            if (entity.type != "minecraft:item")
                return
            let stack = entity.item
            if (stack == null || stack.empty)
                return
            let nbt = stack.nbt
            if (nbt != null && nbt.CollectingChillness != null) {
                if (chocolateMoldFilledIds.indexOf(stack.id) < 0)
                    return
                let quality = qualityUtils.getQuality(stack)
                if (quality.level() > 0) {
                    entity.persistentData.putInt("createdelight_freeze_quality", quality.level())
                }
                return
            }
            if (chocolateMoldSolidIds.indexOf(stack.id) < 0)
                return
            if (!entity.persistentData.contains("createdelight_freeze_quality"))
                return
            let pendingLevel = entity.persistentData.getInt("createdelight_freeze_quality")
            entity.persistentData.remove("createdelight_freeze_quality")
            if (pendingLevel <= 0)
                return
            if (qualityUtils.getQuality(stack).level() > 0)
                return
            qualityUtils.applyQuality(stack, $QualityFoodQuality.get(pendingLevel))
            entity.item = stack
        })
    })
})

ServerEvents.recipes(e => {
    const {create, ratatouille} = e.recipes
    remove_recipes_id(e, [
        "create_confectionery:crushed_cocoa_recipe",
        "create_confectionery:cocoa_powder_and_butter_recipe",
        "create:mixing/normal_chocolate",
        "farmersdelight:cooking/hot_cocoa",
        "create_central_kitchen:emptying/hot_cocoa",
        "create_central_kitchen:filling/hot_cocoa",
        "ratatouille:freezing/chocolate_mold_filled",
        "ratatouille:threshing/cocoanibs",
        "farmersrespite:brewing/hot_cocoa_from_milk"
    ])
    e.replaceInput({ mod: "createcafe" }, "minecraft:cocoa_beans", "ratatouille:cocoa_powder")
    // 热可可
    create.mixing(Fluid.of("farmersrespite:hot_cocoa"), [
        "minecraft:sugar",
        Fluid.of("minecraft:milk"),
        "ratatouille:cocoa_powder"
    ]).heated().id("createdelight:mixing/hot_cocoa")
    e.recipes.farmersrespite.brewing(
        { fluid: "minecraft:milk", count: 1000 },
        ["ratatouille:cocoa_powder", "minecraft:sugar"],
        { fluid: "farmersrespite:hot_cocoa", count: 1000 },
        200,
        0.35
    ).id("createdelight:brewing/hot_cocoa_from_milk")
    // 巧克力
    create.mixing(Fluid.of("create:chocolate", 250), [
        "ratatouille:cocoa_solids",
        "ratatouille:cocoa_butter",
        Fluid.of("minecraft:milk", 250),
        "minecraft:sugar"
    ]).heated().id("createdelight:mixing/chocolate")
    // 黑巧
    create.mixing(Fluid.of("create_confectionery:black_chocolate", 250), [
        "ratatouille:cocoa_solids",
        "ratatouille:cocoa_butter",
        Fluid.of("minecraft:milk", 250)
    ]).heated().id("createdelight:black_chocolate_recipe")
    create.filling("createdelightcore:black_chocolate_mold_filled", [
        Fluid.of("create_confectionery:black_chocolate", 250),
        "ratatouille:chocolate_mold"
    ]).id("createdelight:filling/black_chocolate_mold_filled")
    ratatouille.demolding(
        [
            "create_confectionery:bar_of_black_chocolate",
            "ratatouille:chocolate_mold"
        ],
        "createdelightcore:black_chocolate_mold_solid"
    ).id("createdelight:bar_of_black_chocolate_recipe")
    // 白巧
    create.mixing(Fluid.of("create_confectionery:white_chocolate", 250), [
        "ratatouille:cocoa_butter",
        Fluid.of("minecraft:milk", 250),
        "minecraft:sugar"
    ]).heated().id("createdelight:white_chocolate_recipe")
    create.filling("createdelightcore:white_chocolate_mold_filled", [
        Fluid.of("create_confectionery:white_chocolate", 250),
        "ratatouille:chocolate_mold"
    ]).id("createdelight:filling/white_chocolate_mold_filled")
    ratatouille.demolding(
        [
            "create_confectionery:bar_of_white_chocolate",
            "ratatouille:chocolate_mold"
        ],
        "createdelightcore:white_chocolate_mold_solid"
    ).id("createdelight:bar_of_white_chocolate_recipe")
    // 红宝石巧克力
    create.mixing(Fluid.of("create_confectionery:ruby_chocolate", 250), [
        "ratatouille:cocoa_solids",
        "ratatouille:cocoa_butter",
        Fluid.of("create_dragons_plus:dragon_breath", 250),
        "minecraft:sugar"
    ]).heated().id("createdelight:ruby_chocolate_recipe")
    create.filling("createdelightcore:ruby_chocolate_mold_filled", [
        Fluid.of("create_confectionery:ruby_chocolate", 250),
        "ratatouille:chocolate_mold"
    ]).id("createdelight:filling/ruby_chocolate_mold_filled")
    ratatouille.demolding(
        [
            "create_confectionery:bar_of_ruby_chocolate",
            "ratatouille:chocolate_mold"
        ],
        "createdelightcore:ruby_chocolate_mold_solid"
    ).id("createdelight:bar_of_ruby_chocolate_recipe")
    // 热巧克力
    create.mixing(Fluid.of("create_confectionery:hot_chocolate", 250), [
        Fluid.of("minecraft:milk", 250),
        "minecraft:sugar",
        "create:bar_of_chocolate"
    ]).heated().id("createdelight:hot_chocolate_recipe")
    freezing(e, "ratatouille:chocolate_mold_filled", 'ratatouille:chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:black_chocolate_mold_filled', 'createdelightcore:black_chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:white_chocolate_mold_filled', 'createdelightcore:white_chocolate_mold_solid', 60)
    freezing(e, 'createdelightcore:ruby_chocolate_mold_filled', 'createdelightcore:ruby_chocolate_mold_solid', 60)
    threshing(e, "ratatouille:dried_cocoa_beans", [
        "2x ratatouille:dried_cocoa_nibs",
        Item.of("2x ratatouille:dried_cocoa_nibs").withChance(0.5),
        "createaddition:biomass"
    ])
})
ServerEvents.tags("item", e => {
    e.remove("ratatouille:compostable_items_4to1", [
        "ratatouille:dried_cocoa_beans"
    ])
})
