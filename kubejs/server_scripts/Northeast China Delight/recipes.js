ServerEvents.recipes(e => {
    const {create, kubejs, farmersdelight} = e.recipes
    const soySauce = "northeast_china_delight:soy_sauce"
    const youkai = e.recipes.youkaishomecoming

    create.mixing("2x northeast_china_delight:pig_blood", [
        Fluid.of("butchercraft:blood_fluid", 500),
        "butchercraft:pork_scraps",
        "vintagedelight:salt_dust"
    ]).id("createdelight:mixing/pig_blood")

    create.mixing(Fluid.of("northeast_china_delight:animal_oil", 250), [
        "2x butchercraft:fat"
    ]).id("createdelight:mixing/animal_oil_from_fat")

    // 沿用白菜切叶的产量与工具条件；中央厨房自动生成机械手配方。
    cutting(e, "northeast_china_delight:spicy_cabbage", [
        "2x vintagedelight:kimchi",
        Item.of("vintagedelight:kimchi").withChance(0.3)
    ])

    kubejs.shapeless("northeast_china_delight:roasted_peanuts", [
        "vintagedelight:roasted_peanut",
        "vintagedelight:roasted_peanut"
    ]).id("createdelight:crafting/roasted_peanuts_from_roasted_peanut")

    create.filling("vintagedelight:nut_mash_mason_jar", [
        "vintagedelight:mason_jar", Fluid.of("northeast_china_delight:peanut_butter", 750)
    ]).id("createdelight:filling/vintagedelight/peanut_butter_jar")
    create.emptying([
        "vintagedelight:mason_jar", Fluid.of("northeast_china_delight:peanut_butter", 750)
    ], "vintagedelight:nut_mash_mason_jar").id("createdelight:emptying/vintagedelight/peanut_butter_jar")

    remove_recipes_id(e, [
        "northeast_china_delight:mixing/soy_milk",
        "northeast_china_delight:compacting/vegetable_oil",
        // 木臼配方用原生数据包 JSON 重建，保证 result_mb 为严格整数。
        "northeast_china_delight:pounding/peanut_oil",
        "northeast_china_delight:mixing/chili_oil",
        "northeast_china_delight:filling/vegetable_oil_bottle",
        "northeast_china_delight:emptying/vegetable_oil_bottle",
        "northeast_china_delight:milling/peanut_butter",
        // 使用调料瓶原生流体接口分液；醋与植物油另有合并流体的 KubeJS 配方。
        "northeast_china_delight:emptying/peanut_butter_bottle",
        "northeast_china_delight:emptying/chili_oil_bottle",
        "northeast_china_delight:emptying/soy_sauce_bottle",
        "northeast_china_delight:filling/vinegar_bottle",
        "northeast_china_delight:emptying/vinegar_bottle",
        // 小瓶统一使用东北乐事灌装与按剩余量排液，避免 OEI 合并后出现通配排液。
        "youkaishomecoming:filling/soy_sauce_bottle",
        "youkaishomecoming:emptying/soy_sauce_bottle_emptying",
        "youkaishomecoming:filling/soy_sauce_flask",
        "youkaishomecoming:emptying/soy_sauce_flask_emptying",
        "youkaishomecoming:soy_sauce_bottle",
        "youkaishomecoming:soy_sauce",
        "youkaishomecoming:miso",
        "youkaishomecoming:hokkaido_salmon_hotpot",
        "youkaishomecoming:pot_of_miso_soup",
        "youkaishomecoming:pot_of_power_soup",
        "youkaishomecoming:pot_of_seafood_miso_soup",
        "youkaishomecoming:signature_mushroom_stew",
        "northeast_china_delight:milling/corn_flour",
        // 已合并的九合一包装各保留一条装箱/装袋和一条拆包配方。
        // 黄瓜沿用本包装箱配方；玉米粒沿用东北乐事装袋和本包拆袋配方。
        "northeast_china_delight:corn_crate",
        "northeast_china_delight:corn_crate_unpack",
        "corn_delight:integration/mekanism/sawing/corn_block_sawing",
        "vintagedelight:cucumber_crate",
        "northeast_china_delight:cucumber_crate",
        "northeast_china_delight:cucumber_crate_unpack",
        "northeast_china_delight:eggplant_crate",
        "northeast_china_delight:eggplant_crate_unpack",
        "vintagedelight:ghost_pepper_crate",
        "vintagedelight:ghost_pepper_crate_deconstruct",
        "northeast_china_delight:corn_seeds_sack_unpack",
        "northeast_china_delight:soybean_sack",
        "northeast_china_delight:soybean_sack_unpack",
        "northeast_china_delight:red_bean_sack",
        "northeast_china_delight:red_bean_sack_unpack",
        "northeast_china_delight:peanut_sack",
        "northeast_china_delight:peanut_sack_unpack",
        "northeast_china_delight:pickled_cucumber_crate",
        "northeast_china_delight:pickled_cucumber_crate_unpack"
    ])

    // 保留碗装豆浆，装碗和倒空统一使用本包豆浆（250 mB）。
    e.forEachRecipe({id: "northeast_china_delight:filling/soy_milk_bowl"}, recipe => {
        recipe.json.getAsJsonArray("ingredients").get(1).getAsJsonObject()
            .addProperty("fluid", "createdelight:soya_milk")
        recipe.save()
    })
    e.forEachRecipe({id: "northeast_china_delight:emptying/soy_milk_bowl"}, recipe => {
        recipe.json.getAsJsonArray("results").get(1).getAsJsonObject()
            .addProperty("fluid", "createdelight:soya_milk")
        recipe.save()
    })

    // 原配方解析回退后 replaceInput 不生效，直接替换原料 JSON，保留原 ID 与其他字段。
    const shrimpDumplings = [
        ["northeast_china_delight:cooking/three_delicacy_dumpling", 2],
        ["northeast_china_delight:cooking/shrimp_pork_dumpling", 0]
    ]
    shrimpDumplings.forEach(entry => {
        e.forEachRecipe({id: entry[0]}, recipe => {
            const shrimp = recipe.json.getAsJsonArray("ingredients").get(entry[1]).getAsJsonObject()
            shrimp.remove("tag")
            shrimp.addProperty("item", "oceanic_delight:shrimp_slices")
            recipe.save()
        })
    })

    // 烤花生原配方为 2 个产 500 mB；熟花生米每份产量为单个烤花生的两倍。
    create.compacting(Fluid.of("createdieselgenerators:plant_oil", 500), "northeast_china_delight:roasted_peanuts")
        .id("createdelight:compacting/plant_oil_from_roasted_peanuts")
    create.filling("northeast_china_delight:cooking_oil", [
        "minecraft:glass_bottle", Fluid.of("createdieselgenerators:plant_oil", 250)
    ]).id("createdelight:filling/northeast_china_delight/vegetable_oil_bottle")
    // 当前 KubeJS Create 的流体替换无法匹配；删除原配方后单独重建。
    create.mixing(Fluid.of("northeast_china_delight:chili_oil", 250), [
        Fluid.of("createdieselgenerators:plant_oil", 250),
        "#forge:crops/chile_pepper",
        "#forge:crops/chile_pepper"
    ]).id("createdelight:mixing/chili_oil")

    // 按原生配方用量重建，酱油流体统一为东北乐事。
    youkai.simple_fermentation([
        "#forge:soybean", "#forge:soybean", "#forge:soybean", "#forge:soybean"
    ], Fluid.of("minecraft:water", 1000), Fluid.of("northeast_china_delight:soy_sauce", 1000), [], 1800)
        .id("createdelight:simple_fermentation/soy_sauce")

    create.filling("youkaishomecoming:soy_sauce_flask", [
        "youkaishomecoming:sake_bottle", Fluid.of("northeast_china_delight:soy_sauce", 1000)
    ]).id("createdelight:filling/youkaishomecoming/soy_sauce_flask")
    create.emptying([
        "youkaishomecoming:sake_bottle", Fluid.of("northeast_china_delight:soy_sauce", 1000)
    ], "youkaishomecoming:soy_sauce_flask").id("createdelight:emptying/youkaishomecoming/soy_sauce_flask")

    // 厨锅每份酱油原料只接受 250 mB 小瓶；大瓶需先分液，不能按一份投料。
    youkai.immediate_soup("youkaishomecoming:soy_sauce", [soySauce], 0, 2147483647)
        .id("createdelight:immediate_soup/soy_sauce")
    youkai.immediate_soup("youkaishomecoming:miso", [soySauce, "#forge:soybean"], 100, -1)
        .id("createdelight:immediate_soup/miso")
    youkai.unordered_cooking("youkaishomecoming:hokkaido_salmon_hotpot", [
        soySauce, "#forge:soybean", "youkaishomecoming:tofu", "minecraft:kelp", "minecraft:carrot",
        "minecraft:potato", "minecraft:brown_mushroom", "#forge:salad_ingredients/cabbage",
        "#forge:vegetables/onion", "#forge:raw_fishes/salmon"
    ], 200).id("createdelight:unordered_cooking/hokkaido_salmon_hotpot")
    youkai.unordered_cooking("youkaishomecoming:pot_of_miso_soup", [
        soySauce, "#forge:soybean", "youkaishomecoming:tofu", "youkaishomecoming:tofu",
        "youkaishomecoming:tofu", "minecraft:dried_kelp", "minecraft:dried_kelp", "minecraft:brown_mushroom"
    ], 400).id("createdelight:unordered_cooking/pot_of_miso_soup")
    youkai.unordered_cooking("youkaishomecoming:pot_of_power_soup", [
        soySauce, "#forge:soybean", "#forge:raw_boar", "#forge:raw_venison", "minecraft:kelp",
        "minecraft:carrot", "#forge:vegetables/tomato", "#forge:salad_ingredients/cabbage", "#forge:vegetables/onion"
    ], 400).id("createdelight:unordered_cooking/pot_of_power_soup")
    youkai.unordered_cooking("youkaishomecoming:pot_of_seafood_miso_soup", [
        soySauce, "#forge:soybean", "youkaishomecoming:tofu", "youkaishomecoming:tofu",
        "minecraft:dried_kelp", "minecraft:dried_kelp", "minecraft:brown_mushroom",
        "#forge:vegetables/onion", "#forge:raw_fishes/salmon", "#forge:raw_fishes/salmon"
    ], 400).id("createdelight:unordered_cooking/pot_of_seafood_miso_soup")
    youkai.unordered_cooking("youkaishomecoming:signature_mushroom_stew", [
        soySauce, "minecraft:red_mushroom", "minecraft:brown_mushroom", "#forge:mushrooms"
    ], 200).id("createdelight:unordered_cooking/signature_mushroom_stew")

    // 3.1.1 支持按流体 ID 指定大缸产物；保留原酿醋条件、产量和盛取物品。
    e.forEachRecipe({id: "northeast_china_delight:vat/vinegar"}, recipe => {
        const config = recipe.json.getAsJsonObject("config")
        const liquid = config.getAsJsonObject("liquid")
        liquid.addProperty("product", "createdelight:vinegar")
        liquid.addProperty("serving_container", "minecraft:glass_bottle")
        liquid.addProperty("serving_item", "northeast_china_delight:vinegar")
        recipe.save()
    })

    create.filling("northeast_china_delight:vinegar", [
        "minecraft:glass_bottle",
        Fluid.of("createdelight:vinegar", 250)
    ]).id("createdelight:filling/northeast_china_delight/vinegar_bottle")

    // 3.1.1 的 Damage 表示已消耗毫升数。显式配方优先于瓶流体能力，
    // 逐值匹配按剩余量输出统一后的流体，避免回退到原生瓶流体能力。
    const seasoningBottles = [
        ["vinegar", "createdelight:vinegar"],
        ["cooking_oil", "createdieselgenerators:plant_oil"]
    ]
    seasoningBottles.forEach(bottle => {
        for (let usedMb = 0; usedMb < 250; usedMb++) {
            create.emptying([
                "minecraft:glass_bottle",
                Fluid.of(bottle[1], 250 - usedMb)
            ], Item.of(`northeast_china_delight:${bottle[0]}`, {Damage: usedMb}).weakNBT())
            .id(`createdelight:emptying/northeast_china_delight/${bottle[0]}_bottle/damage_${usedMb}`)
        }
    })
})
