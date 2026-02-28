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
            (recipe) => {
                let ingredients = recipe.getIngredients();
                let inputs = [];
                ingredients.forEach(i => inputs.push(i));

                // 序列组装配方
                if (recipe.getSequence) {
                    recipe.getSequence().forEach(step => {
                        let stepRecipe = step.getRecipe();
                        // 机械手配方不消耗手持物品时的特殊处理
                        if (stepRecipe.shouldKeepHeldItem && stepRecipe.shouldKeepHeldItem()) return;

                        let stepIngs = stepRecipe.getIngredients();
                        if (stepIngs.size() > 1) {
                            inputs.push(stepIngs.get(1));
                        }
                    });
                }
                // 机械手配方不消耗手持物品时的特殊处理：只保留被处理物品
                else if (recipe.shouldKeepHeldItem && recipe.shouldKeepHeldItem()) {
                    if (inputs.length > 0) {
                        inputs = [inputs[0]];
                    }
                }
                return inputs;
            },
            (recipe, registryAccess) => {
                if (recipe.getRollableResults) {
                    let results = recipe.getRollableResults();
                    let uniqueItemMap = {}; // 用于去重产物
                    results.forEach(output => {
                        let itemStack = output.getStack();
                        let count = itemStack.getCount();
                        let itemId = String(itemStack.getItem().getId()); // 获取 ID (如 minecraft:gravel)
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
                let currentTotalValue = totalValue * multiplier;

                // 兼容机械动力的概率产出，计算每个产物期望数量并分别设置价值
                if (recipe.getRollableResults) {
                    let results = recipe.getRollableResults();
                    let itemCountMap = {};
                    let totalUnpricedCnt = 0.0;
                    let consumedValue = 0.0;

                    // console.log(recipe)
                    // 第一遍遍历：统计期望数量和已消耗的价值
                    results.forEach(output => {
                        let itemStack = output.getStack();
                        let count = itemStack.getCount();
                        let itemId = String(itemStack.getItem().getId()); // 获取 ID (如 minecraft:gravel)
                        let chance = output.getChance();
                        // console.log(String(itemStack) + " " + String(chance));

                        // 黑名单内的物品不参与价值分配
                        if (global.ValueBlackList.indexOf(itemId) !== -1) return;

                        if (!itemStack.isEmpty() && count > 0) {
                            let expectedCount = count * chance;
                            itemCountMap[itemId] = (itemCountMap[itemId] || 0.0) + expectedCount;

                            let definedValue = global.FoodIngredientValueDict.get(itemId);
                            if (definedValue !== undefined) {
                                consumedValue += definedValue * expectedCount;
                            } else {
                                totalUnpricedCnt += expectedCount;
                            }
                        }
                    })
                    // console.log(itemCountMap);

                    // 如果原材料总价值为0，则不设置产物价值
                    if (currentTotalValue === 0) return;

                    // 计算剩余价值分配给未定价物品
                    let remainingValue = currentTotalValue - consumedValue;

                    // 计算未定价物品的单价，最差为 1
                    let valuePerUnpricedUnit = 1;
                    if (totalUnpricedCnt > 0) {
                        valuePerUnpricedUnit = Math.max(1, remainingValue / totalUnpricedCnt);
                    }

                    // 第二遍遍历：设置价值
                    Object.keys(itemCountMap).forEach(itemId => {
                        // 只设置未定价物品
                        if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                            // Item.of(itemId) 默认为 1 个物品，因此直接设置单价即可
                            // console.log(String(recipe) + " " + itemId + " " + String(valuePerUnpricedUnit));
                            setter.set(recipe, Item.of(itemId), valuePerUnpricedUnit);
                        }
                    })
                }
                else {
                    let consumedValue = 0.0;
                    let totalUnpricedCnt = 0.0;

                    // 第一遍：统计
                    stacks.forEach(stack => {
                        if (!stack.isEmpty() && stack.getCount() > 0) {
                            let itemId = String(stack.getItem().getId());

                            // 黑名单内的物品不参与价值分配
                            if (global.ValueBlackList.indexOf(itemId) !== -1) return;

                            let count = stack.getCount();

                            let definedValue = global.FoodIngredientValueDict.get(itemId);
                            if (definedValue !== undefined) {
                                consumedValue += definedValue * count;
                            } else {
                                totalUnpricedCnt += count;
                            }
                        }
                    });

                    // 如果原材料总价值为0，则不设置产物价值
                    if (currentTotalValue === 0) return;

                    let remainingValue = currentTotalValue - consumedValue;

                    // 计算未定价物品的单价，最差为 1
                    let valuePerUnpricedUnit = 1;
                    if (totalUnpricedCnt > 0) {
                        valuePerUnpricedUnit = Math.max(1, remainingValue / totalUnpricedCnt);
                    }

                    // 第二遍：设置
                    stacks.forEach(stack => {
                        if (!stack.isEmpty() && stack.getCount() > 0) {
                            let itemId = String(stack.getItem().getId());
                            if (global.ValueBlackList.indexOf(itemId) !== -1) return;

                            if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                                // setter 逻辑: 如果 itemStack 有多个，单价 = value / count
                                // 因此这里我们需要传入 单价 * 数量
                                let stackValue = valuePerUnpricedUnit * stack.getCount();
                                // console.log(String(recipe) + " " + String(stack) + " " + String(stackValue));
                                setter.set(recipe, stack, stackValue);
                            }
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