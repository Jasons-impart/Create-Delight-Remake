OEVEvents.addItemValue(event => {
    // 清空OEV自带的基础价值表
    event.getValueManager().baseValueMap.clear()

    global.FoodIngredientList.forEach(Ingredient => {
        let value = global.FoodIngredientValueDict.get(Ingredient) ?? global.DefaultFoodIngredientValue;
        event.addBaseItemValue(Ingredient, value);
    });

    // 通过匹配nbt增加额外价值，如tacz的枪械。
    // event.addExtraItemValue('{GunId:"tacz:m700"}', 500000);
});