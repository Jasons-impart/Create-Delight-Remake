let $RecipeType = Java.loadClass("net.minecraft.world.item.crafting.RecipeType");

OEVEvents.addRecipeHandler(event => {
    // 第一个参数为RecipeType，你可以使用字符串来代表
    // 也可以去loadClass获取RecipeType实例
    // 辅助方法，输出一个数组，包含所有已注册的配方类型。
    console.log("all recipe types");
    console.log(event.getAllRecipeType());
    // crafting
    // smelting
    // smoking
    // create:milling
    // campfire_cooking
    // brewinandchewin:keg_pouring
    // farmersrespite:brewing
    // farmersrespite:kettle_pouring
    // festival_delicacies:stove
    // grill_cooking
    // toaster_heating
    // cutting_board_slicing
    // cutting_board_combining
    // microwave_heating
    // frying_pan_cooking
    // oven_baking
    // com.renyigesai.bakeries.recipe.oven.OvenRecipe$Type@3668793e
    // com.renyigesai.bakeries.recipe.DoughCraftingRecipe$Type@6efe6a20
    // com.renyigesai.bakeries.recipe.flour_sieve.FlourSieveRecipe$Type@2fde1786
    // com.renyigesai.bakeries.recipe.toaster.ToasterRecipe$Type@7b9191c9
    // com.renyigesai.bakeries.recipe.BlenderRecipe$Type@2f0e4848
    // com.renyigesai.bakeries.recipe.CoffeeRecipe$Type@24fb807c
    // com.renyigesai.bakeries.recipe.BreadKnifeRecipe$Type@11ae0e20
    // com.renyigesai.bakeries.recipe.FermentationRecipe$Type@20144029
    // frycooks_delight:frying
    // farmersdelight:cooking
    // farmersdelight:cutting
    // dungeonsdelight:monster_cooking
    // wine_fermentation
    // apple_mashing
    // apple_fermenting
    // minecraft:create_bic_bit
    // create:composting
    // create:baking
    // create_central_kitchen:cutting_board_deploying

    // 这些不确定是不是食物相关配方，先不实现，等碰到反馈再加
    // createdelight:butchery
    // createdieselgenerators:basin_fermenting
    // createdieselgenerators:bulk_fermenting
    // brewinandchewin:fermenting
    // butcher_block


    // event.addCustomRecipeHandler("crafting",
    //     // 获取输入物品，正常你应该不需要改
    //     event.defaultRecipeInputGetter,
    //     // 设置输出物品，多物品输出你可能需要重写这部分
    //     event.defaultRecipeOutputGetter,
    //     // 设置配方的额外价值，例如熔炉燃烧时间提供额外价值
    //     event.defaultRecipeExtraValueGetter,
    //     // 配方价值设置，单输出情况下你不需要管
    //     // 多物品输入你需要自行分配每个输出物品的价值，不然会只给第一个物品设置
    //     event.defaultRecipeValueSetter
    // )

    // event.addCustomRecipeHandler($RecipeType.CRAFTING,
    //     event.defaultRecipeInputGetter,
    //     event.defaultRecipeOutputGetter,
    //     event.defaultRecipeExtraValueGetter,
    //     (recipe, stacks, totalValue, setter) => {
    //         // 配方十倍价值
    //         setter.set(recipe, stacks.get(0), totalValue * 10);
    //     }
    // )

});