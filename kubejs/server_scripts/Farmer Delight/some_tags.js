ServerEvents.tags("item", e => {
    // 给各类刀提供农夫乐事兼容
    e.add("farmersdelight:tools/knives", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    e.add("sliceanddice:allowed_tools", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    e.add("farmersdelight:straw_harvesters", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    e.add("create:upright_on_deployer", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    e.add("forge:tools/knives", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    e.add("forge:tools", [
        "nethersdelight:iron_machete",
        "nethersdelight:golden_machete",
        "nethersdelight:diamond_machete",
        "nethersdelight:netherite_machete"
    ])
    // 西蓝花兼容沙拉
    e.add("forge:salad_ingredients", [
        "candlelight:broccoli"
    ])
    e.add("forge:salad_ingredients/cabbage", [
        "candlelight:broccoli"
    ])
})
