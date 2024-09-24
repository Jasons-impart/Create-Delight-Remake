ServerEvents.recipes(e => {

//工作盆 <recipetype:create:compacting>.addRecipe("配方名", "热量", 输出, [输入物品], [输入流体], 时间);
//动力搅拌器 <recipetype:create:mixing>.addRecipe("配方名", "热量", 输出, [输入物品], [输入流体], 时间);
//动力锯 <recipetype:create:cutting>.addRecipe("配方名", 输出物品, 输入物品);
//注液器 <recipetype:create:filling>.addRecipe(配方名, 输出,输入物品, 输入流体,);
//分液池 <recipetype:create:emptying>.addRecipe(配方名, 输出物品, 输出流体, 输入物品,);
//粉碎论 <recipetype:create:crushing>.addRecipe(配方名, [输出,输出概率] , 输入, );
//石磨 <recipetype:create:milling>.addRecipe(配方名, [输出 输出概率] , 输入,)
//动力合成器 <recipetype:create:mechanical_crafting>.addRecipe(配方名, 输出, [[输入],[输入]])
//砂纸打磨 <recipetype:create:sandpaper_polishing>.addRecipe(配方名, 输出, 输出,)
//热量：没有（none）普通加热（heated）超级加热（superheated）


    //序列装配九转大肠
    let iner_2 = "createdelight:braised_intestines_in_brown_sauce" //iner_2替代中间产物
    e.recipes.create.sequenced_assembly("createdelight:braised_intestines_in_brown_sauce","butchercraft:cooked_tripe",[
        e.recipes.create.deploying(iner_2, [iner_2, "butchercraft:cooked_tripe"]),
        e.recipes.create.deploying(iner_2, [iner_2, "festival_delicacies:greenonion"]),
        e.recipes.create.deploying(iner_2, [iner_2, "butchercraft:lard"]),
        e.recipes.create.deploying(iner_2, [iner_2, "vintagedelight:vinegar_bottle"]),
        e.recipes.create.deploying(iner_2, [iner_2, "farmersdelight:apple_cider"]),
        e.recipes.create.deploying(iner_2, [iner_2, "butchercraft:cooked_tripe"]),
    ])
        .transitionalItem(iner_2)
        .loops(9)
        .id("createdelight:braised_intestines_in_brown_sauce")

    //搅拌器开水白菜
    e.recipes.create.mixing("createdelight:boiling_water_cabbage",[
        "festival_delicacies:chinese_cabbage", 
        "minecraft:bowl",
        "vintagedelight:salt_dust", 
        Fluid.of("minecraft:water", 500), 
    ])  
        .heated()
        // .replaceIngredient({item:"createdelight:boiling_water_cabbage"},"minecraft:bowl")
        .id("createdelight:boiling_water_cabbage")
         
})
// e.recipes.create.mixing(Fluid.of("minecraft:water", 500), [
//   "#forge:crops/chinese_cabbage",
//   "vintagedelight:salt_dust",
//   Fluid.of("minecraft:water", 500),
// ])

// .heated();
    // //芒果奶茶
    // e.recipes.create.mixing(Fluid.of("createcafe:mango_tea", 500), [
    //     "fruitsdelight:mango", 
    //     "minecraft:sugar", 
    //     Fluid.of("minecraft:milk", 200), 
    //     Fluid.of("farmersrespite:dandelion_tea", 100)
    // ]).heated().id("createcafe:mixing/mango_tea_mixing")