let $RecipeType = Java.loadClass("net.minecraft.world.item.crafting.RecipeType");

OEVEvents.addRecipeHandler(event => {
    // 第一个参数为RecipeType，你可以使用字符串来代表
    // 也可以去loadClass获取RecipeType实例

    let defaultMultiplier = global.DefaultRecipeValueMultiplier;

    // 辅助方法，输出一个数组，包含所有已注册的配方类型。
    event.getAllRecipeType().forEach(RecipeType => {
        // toString返回的是Java 的 String 对象，无法直接与kjs里的JS string对比，因此需要手动转化
        let typeName = String(RecipeType.toString());
        let multiplier = global.RecipeValueMultiplierDict.get(typeName) ?? defaultMultiplier;
        // console.log(typeName + ":" + multiplier);
        event.addCustomRecipeHandler(RecipeType,
            event.defaultRecipeInputGetter,
            (recipe, registryAccess) => {
                if (recipe.getRollableResults) {
                    let results = recipe.getRollableResults();
                    let uniqueItemMap = {}; // 用于去重产物
                    results.forEach(output => {
                        let itemStack = output.getStack();
                        let count = itemStack.getCount();
                        let itemId = itemStack.getItem().getId(); // 获取 ID (如 minecraft:gravel)
                        if (!itemStack.isEmpty() && count > 0 && !uniqueItemMap[itemId]) {
                            uniqueItemMap[itemId] = Item.of(itemId);
                        }
                    })
                    // console.log(Object.keys(uniqueItemMap));
                    return Object.values(uniqueItemMap);
                }
                else {
                    let stack = recipe.getResultItem(registryAccess);
                    if (stack.isEmpty() || stack.getCount() === 0) return [];
                    return [stack];
                }
            },
            event.defaultRecipeExtraValueGetter,
            // event.defaultRecipeValueSetter
            (recipe, stacks, totalValue, setter) => {
                // 兼容机械动力的概率产出，计算每个产物期望数量并分别设置价值
                if (recipe.getRollableResults) {
                    let results = recipe.getRollableResults();
                    let itemCountMap = {};
                    let totalCnt = 0.0;

                    // console.log(recipe)
                    // 计算每种产物期望数量
                    results.forEach(output => {
                        let itemStack = output.getStack();
                        let count = itemStack.getCount();
                        let itemId = itemStack.getItem().getId(); // 获取 ID (如 minecraft:gravel)
                        let chance = output.getChance();
                        // console.log(String(itemStack) + " " + String(chance));

                        if (!itemStack.isEmpty() && count > 0) {
                            itemCountMap[itemId] = (itemCountMap[itemId] || 0.0) + count * chance;
                            totalCnt += itemCountMap[itemId];
                        }
                    })
                    // console.log(itemCountMap);

                    // 每个产物均分价值
                    Object.keys(itemCountMap).forEach(itemId => {
                        let expectedCount = itemCountMap[itemId];
                        // console.log(String(recipe) + " " + itemId + " " + String(totalValue * multiplier * expectedCount / totalCnt));
                        setter.set(recipe, Item.of(itemId), totalValue * multiplier * expectedCount / totalCnt);
                    })
                }
                else {
                    stacks.forEach(stack => {
                        if (!stack.isEmpty() && stack.getCount() > 0) {
                            // console.log(String(recipe) + " " + String(stack) + " " + String(totalValue * multiplier));
                            setter.set(recipe, stack, totalValue * multiplier);
                        }
                    })
                }
            }
        );

        // // 如果再次addCustomRecipeHandler，则会覆盖之前的设置，因此下面可以针对不同的配方进行单独设置
        // event.addCustomRecipeHandler(RecipeType,
        //     // 获取输入物品，正常你应该不需要改
        //     event.defaultRecipeInputGetter,
        //     // 设置输出物品，多物品输出你可能需要重写这部分
        //     // (recipe, registryAccess) => [ ItemStack ]
        //     event.defaultRecipeOutputGetter,
        //     // 设置配方的额外价值，例如熔炉燃烧时间提供额外价值
        //     event.defaultRecipeExtraValueGetter,
        //     // 配方价值设置，单输出情况下你不需要管
        //     // 多物品输入你需要自行分配每个输出物品的价值，不然会只给第一个物品设置
        //     // (recipe, stacks, totalValue, setter) => void
        //     // 其中 stacks 为上面outputGetter的输出
        //     //      totalValue 为根据配方输入物品价值和额外价值求和计算出的结果
        //     //      setter.set(recipe, itemStack, value : int) 用来给itemStack设置价值
        //     //          如果itemStack里物品有多个，则单个物品获得value/count的价值
        //     // 一般情况下，传给setter的itemStack取输入的stacks里的元素即可，但并不限制你任意构建一个itemStack
        //     event.defaultRecipeValueSetter
        // )
    });
});