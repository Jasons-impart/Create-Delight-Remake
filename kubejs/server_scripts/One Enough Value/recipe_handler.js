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
        
        // 这里选择了所有配方一起处理，在传入的函数里根据配方类型判断是否需要特殊处理
        // 后续如果有需要，可能根据配方类型RecipeType，每个RecipeType单独注册addCustomRecipeHandler可读性更高
        event.addCustomRecipeHandler(RecipeType,
            (recipe) => {
                let ingredients = recipe.getIngredients();
                let inputs = [];
                ingredients.forEach(i => inputs.push(i));

                // 序列组装配方
                if (recipe.getSequence) {
                    // 添加起始原料，注意这里的方法和上面不是同一个（少个s）
                    let startIngredient = recipe.getIngredient();
                    inputs.push(startIngredient);
                    recipe.getSequence().forEach(step => {
                        let stepRecipe = step.getRecipe();
                        // 机械手配方不消耗手持物品时的特殊处理
                        if (stepRecipe.shouldKeepHeldItem && stepRecipe.shouldKeepHeldItem()) return;

                        let stepIngs = stepRecipe.getIngredients();
                        if (stepIngs.size() == 2) {
                            inputs.push(stepIngs.get(1));
                        }
                    });
                }
                return inputs;
            },
            (recipe, registryAccess) => {
                let stack = recipe.getResultItem(registryAccess);
                if (stack.isEmpty() || stack.getCount() === 0) return [];
                return [stack];
            },
            event.defaultRecipeExtraValueGetter,
            // event.defaultRecipeValueSetter
            (recipe, stacks, totalValue, setter) => {
                let currentTotalValue = totalValue * multiplier;
                
                // 统一处理逻辑：计算未定价物品的价值分配
                function calculateValueDistribution(items, itemCountMap, totalUnpricedCnt, consumedValue) {
                    // 统计数量和已消耗的价值
                    items.forEach(item => {
                        let itemStack, count, chance = 1.0;
                        
                        // 自动判断输入类型
                        if (item.getStack && item.getChance) {
                            // 处理 序列组装的产出物
                            itemStack = item.getStack();
                            count = itemStack.getCount();
                            chance = item.getChance();
                        } else {
                            // 处理普通物品栈
                            itemStack = item;
                            count = itemStack.getCount();
                        }
                        
                        let itemId = String(itemStack.getItem().getId());
                        
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
                    });
                    
                    // 修复：确保返回对象的语法正确
                    return {
                        itemCountMap: itemCountMap,
                        totalUnpricedCnt: totalUnpricedCnt,
                        consumedValue: consumedValue
                    };
                }
                
                // 1. 初始化变量
                let itemCountMap = {};
                let totalUnpricedCnt = 0.0;
                let consumedValue = 0.0;
                
                // 2. 先计算 stacks 中的物品价值分配
                let stacksResult = calculateValueDistribution(stacks, itemCountMap, totalUnpricedCnt, consumedValue);
                itemCountMap = stacksResult.itemCountMap;
                totalUnpricedCnt = stacksResult.totalUnpricedCnt;
                consumedValue = stacksResult.consumedValue;
                
                // 3. 如果是机械动力概率产出，补充计算 序列组装的产出物 中的物品价值分配
                if (recipe.getRollableResults) {
                    let rollableResults = recipe.getRollableResults();
                    let rollableResult = calculateValueDistribution(rollableResults, itemCountMap, totalUnpricedCnt, consumedValue);
                    itemCountMap = rollableResult.itemCountMap;
                    totalUnpricedCnt = rollableResult.totalUnpricedCnt;
                    consumedValue = rollableResult.consumedValue;
                }
                
                // 4. 计算未定价物品的单价
                let valuePerUnpricedUnit = 1;
                if (currentTotalValue > 0 && totalUnpricedCnt > 0) {
                    let remainingValue = currentTotalValue - consumedValue;
                    valuePerUnpricedUnit = Math.max(1, remainingValue / totalUnpricedCnt);
                }
                
                // 5. 统一设置价值
                // 设置 stacks 中的物品价值
                stacks.forEach(stack => {
                    if (!stack.isEmpty() && stack.getCount() > 0) {
                        let itemId = String(stack.getItem().getId());
                        if (global.ValueBlackList.indexOf(itemId) !== -1) return;
                        
                        if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                            let stackValue = valuePerUnpricedUnit * stack.getCount();
                            setter.set(recipe, stack, stackValue);
                        }
                    }
                });
                
                // 设置 rollableResults 中的物品价值
                if (recipe.getRollableResults) {
                    let rollableResults = recipe.getRollableResults();
                    rollableResults.forEach(result => {
                        let itemStack = result.getStack();
                        let itemId = String(itemStack.getItem().getId());
                        
                        // 黑名单内的物品不参与价值分配
                        if (global.ValueBlackList.indexOf(itemId) !== -1) return;
                        
                        if (!itemStack.isEmpty() && itemStack.getCount() > 0) {
                            if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                                // 检查该物品是否已经在 stacks 中处理过
                                let isProcessed = stacks.some(stack => 
                                    !stack.isEmpty() && 
                                    String(stack.getItem().getId()) === itemId
                                );
                                if (!isProcessed) {
                                    setter.set(recipe, Item.of(itemId), valuePerUnpricedUnit);
                                }
                            }
                        }
                    });
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