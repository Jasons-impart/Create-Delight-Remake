ServerEvents.recipes(e => {
    //屠宰山羊
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:goat_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(500)
        .outputItems("10x butchercraft:goat_chop")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("8x butchercraft:tripe")
        .outputItems("7x butchercraft:goat_roast")
        .outputItems("2x butchercraft:goat_ribs")
        .outputItems("3x butchercraft:cubed_goat")
        .outputItems("10x butchercraft:goat_scraps")
        .outputItems("6x butchercraft:goat_stewmeat")
        .outputItems("13x minecraft:bone")
        .outputItems("6x butchercraft:leather_scrap")
        .outputItems("20x butchercraft:sinew")
        .outputItems("8x butchercraft:fat")
        .outputItems("butchercraft:goat_head_item")
        .outputItems("butchercraft:goat_hide")
        .outputFluids("butchercraft:blood_fluid")
        .id("createdelight:butcher/goat")
    //屠宰羊
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:sheep_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(500)
        .outputItems("10x minecraft:mutton")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("4x butchercraft:tripe")
        .outputItems("8x butchercraft:lamb_roast")
        .outputItems("3x butchercraft:lamb_ribs")
        .outputItems("3x butchercraft:cubed_lamb")
        .outputItems("10x butchercraft:lamb_scraps")
        .outputItems("6x butchercraft:lamb_stewmeat")
        .outputItems("14x minecraft:bone")
        .outputItems("10x butchercraft:leather_scrap")
        .outputItems("18x butchercraft:sinew")
        .outputItems("8x butchercraft:fat")
        .outputItems("butchercraft:sheep_head_item")
        .outputItems("butchercraft:sheep_hide")
        .outputFluids("butchercraft:blood_fluid")
        .id("createdelight:butcher/sheep")
    //屠宰牛
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:cow_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(500)
        .outputItems("64x minecraft:beef")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("4x butchercraft:stomach")
        .outputItems("8x butchercraft:tripe")
        .outputItems("21x butchercraft:beef_roast")
        .outputItems("6x butchercraft:beef_ribs")
        .outputItems("9x butchercraft:cubed_beef")
        .outputItems("3x butchercraft:oxtail")
        .outputItems("30x butchercraft:beef_scraps")
        .outputItems("24x butchercraft:beef_stewmeat")
        .outputItems("14x minecraft:bone")
        .outputItems("18x butchercraft:leather_scrap")
        .outputItems("8x butchercraft:sinew")
        .outputItems("8x butchercraft:fat")
        .outputItems("butchercraft:cow_head_item")
        .outputItems("butchercraft:cow_hide")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 3000))
        .id("createdelight:butcher/cow")
    //屠宰猪
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:pig_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(500)
        .outputItems("12x minecraft:porkchop")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("8x butchercraft:tripe")
        .outputItems("10x butchercraft:pork_roast")
        .outputItems("6x butchercraft:pork_ribs")
        .outputItems("4x butchercraft:cubed_pork")
        .outputItems("14x butchercraft:pork_scraps")
        .outputItems("10x butchercraft:pork_stewmeat")
        .outputItems("16x minecraft:bone")
        .outputItems("6x butchercraft:leather_scrap")
        .outputItems("20x butchercraft:sinew")
        .outputItems("10x butchercraft:fat")
        .outputItems("butchercraft:pig_head_item")
        .outputItems("butchercraft:pig_hide")
        .outputItems("2x farmersdelight:ham")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 2000))
        .id("createdelight:butcher/pig")
    //屠宰鸡
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:chicken_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:chicken")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("butchercraft:chicken_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/chicken")
    //屠宰黑兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:black_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_black_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/black_rabbit")
    //屠宰棕兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:brown_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_brown_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/brown_rabbit")
    //屠宰斑点兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:splotched_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_splotched_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/splotched_rabbit")
    //屠宰金兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:gold_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_gold_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/gold_rabbit")
    //屠宰盐腌兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:salt_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_salt_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/salt_rabbit")
    //屠宰白兔
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:white_rabbit_carcass")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(200)
        .outputItems("minecraft:rabbit")
        .outputItems("butchercraft:heart")
        .outputItems("2x butchercraft:lung")
        .outputItems("2x butchercraft:kidney")
        .outputItems("butchercraft:liver")
        .outputItems("butchercraft:stomach")
        .outputItems("butchercraft:tripe")
        .outputItems("6x butchercraft:sinew")
        .outputItems("5x butchercraft:fat")
        .outputItems("minecraft:rabbit_foot")
        .outputItems("butchercraft:rabbit_white_head_item")
        .outputFluids(Fluid.of("butchercraft:blood_fluid", 500))
        .id("createdelight:butcher/white_rabbit")
    //屠宰牛头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:cow_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:cow_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("butchercraft:tongue")
        .outputItems("8x butchercraft:beef_scraps")
        .outputItems("5x butchercraft:leather_scrap")
        .outputItems("2x butchercraft:horn")
        .id("createdelight:butcher/cow_head")
    //屠宰羊头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:sheep_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:sheep_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("butchercraft:tongue")
        .outputItems("8x butchercraft:lamb_scraps")
        .outputItems("5x butchercraft:leather_scrap")
        .outputItems("3x minecraft:string")
        .id("createdelight:butcher/sheep_head")
    //屠宰猪头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:pig_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:pig_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("butchercraft:tongue")
        .outputItems("8x butchercraft:pork_scraps")
        .outputItems("3x butchercraft:leather_scrap")
        .id("createdelight:butcher/pig_head")
    //屠宰山羊头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:goat_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:goat_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("butchercraft:tongue")
        .outputItems("8x butchercraft:goat_scraps")
        .outputItems("4x butchercraft:leather_scrap")
        .id("createdelight:butcher/goat_head")
    //屠宰鸡头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:chicken_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:chicken_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("butchercraft:wattle")
        .outputItems("butchercraft:beak")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems("minecraft:feather")
        .id("createdelight:butcher/chicken_head")
    //屠宰棕兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_brown_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:brown_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:brown_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_brown_head")
    //屠宰金兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_gold_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:gold_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:gold_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_gold_head")
    //屠宰盐腌兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_salt_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:salt_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:salt_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_salt_head")
    //屠宰斑点兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_splotched_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:splotched_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:splotched_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_splotched_head")
    //屠宰白兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_white_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:white_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:white_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_white_head")
    //屠宰黑兔头
    e.recipes.createdelight.butchery()
        .inputItems("butchercraft:rabbit_black_head_item")
        .perTick(builder => builder
            .inputStress(1024)
        )
        .duration(100)
        .outputItems("butchercraft:rabbit_skull_head_item")
        .outputItems("2x butchercraft:eyeball")
        .outputItems("butchercraft:brain")
        .outputItems("3x butchercraft:rabbit_scraps")
        .outputItems("2x butchercraft:leather_scrap")
        .outputItems(Item.of("butchercraft:black_bunny_ears", "{Damage:0}"))
        .outputItems(Item.of("butchercraft:black_bunny_tail", "{Damage:0}"))
        .id("createdelight:butcher/rabbit_black_head")
})