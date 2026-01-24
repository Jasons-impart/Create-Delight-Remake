OEVEvents.addItemValue(event => {
    global.FoodIngredientList.forEach(Ingredient => {
        // console.log(global.DefaultFoodIngredientValue);
        let value = global.FoodIngredientValueDict.get(Ingredient) ?? global.DefaultFoodIngredientValue;
        // console.log(Ingredient, value);
        event.addBaseItemValue(Ingredient, value);
    });

    // 通过匹配nbt增加额外价值，如tacz的枪械。
    // event.addExtraItemValue('{GunId:"tacz:m700"}', 500000);
});