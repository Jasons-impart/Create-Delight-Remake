function toArray(iterable) {
    let arr = [];
    if (!iterable) return arr;

    try {
        if (typeof iterable.size === 'function' && typeof iterable.get === 'function') {
            let size = iterable.size();
            for (let i = 0; i < size; i++) {
                try {
                    arr.push(iterable.get(i));
                } catch (e) {
                    logSkippedItem(iterable, 'toArray:get', e);
                }
            }
            return arr;
        }

        if (Array.isArray(iterable) || iterable.length !== undefined) {
            for (let i = 0; i < iterable.length; i++) {
                try {
                    arr.push(iterable[i]);
                } catch (e) {
                    logSkippedItem(iterable, 'toArray:index', e);
                }
            }
            return arr;
        }

        if (typeof iterable.forEach === 'function') {
            iterable.forEach(item => arr.push(item));
        }
    } catch (e) {
        logSkippedItem(iterable, 'toArray', e);
    }

    return arr;
}

function safeExtractItem(item) {
    if (!item) return null;

    let stack = null;
    let chance = 1.0;

    try {
        if (typeof item.getStack === 'function') {
            stack = item.getStack();
        }
    } catch (e) {
        logSkippedItem(item, 'safeExtractItem:getStack', e);
    }

    if (!stack) {
        try {
            if (item.stack) stack = item.stack;
        } catch (e) {
            logSkippedItem(item, 'safeExtractItem:stack', e);
        }
    }

    if (!stack) {
        try {
            if (typeof item.getCount === 'function' && typeof item.isEmpty === 'function') {
                stack = item;
            }
        } catch (e) {
            logSkippedItem(item, 'safeExtractItem:itemStack', e);
        }
    }

    if (!stack) return null;

    try {
        if (typeof item.getChance === 'function') {
            chance = item.getChance();
        } else if (typeof item.chance === 'number') {
            chance = item.chance;
        }
    } catch (e) {
        logSkippedItem(item, 'safeExtractItem:chance', e);
    }

    try {
        if (typeof stack.isEmpty !== 'function' || stack.isEmpty()) return null;
        if (typeof stack.getCount !== 'function') return null;

        let count = stack.getCount();
        if (count <= 0) return null;

        return { stack: stack, count: count, chance: chance };
    } catch (e) {
        logSkippedItem(item, 'safeExtractItem:validate', e);
        return null;
    }
}

function isValidItemStack(stack) {
    try {
        return stack && typeof stack.isEmpty === 'function' && !stack.isEmpty()
            && typeof stack.getCount === 'function' && stack.getCount() > 0;
    } catch (e) {
        logSkippedItem(stack, 'isValidItemStack', e);
        return false;
    }
}

function collectItemIds(items) {
    let ids = {};
    toArray(items).forEach(item => {
        let extracted = safeExtractItem(item);
        if (!extracted) return;

        try {
            ids[String(extracted.stack.getItem().getId())] = true;
        } catch (e) {
            logSkippedItem(item, 'collectItemIds', e);
        }
    });

    return ids;
}

function getRecipeOutputStacks(recipe, registryAccess) {
    let outputs = [];

    try {
        let stack = recipe.getResultItem(registryAccess);
        if (isValidItemStack(stack)) outputs.push(stack);
    } catch (e) {
        logSkippedItem(recipe, 'outputGetter:getResultItem', e);
    }

    if (outputs.length > 0 || !recipe.getRollableResults) return outputs;

    try {
        toArray(recipe.getRollableResults()).forEach(result => {
            let extracted = safeExtractItem(result);
            if (extracted) outputs.push(extracted.stack);
        });
    } catch (e) {
        logSkippedItem(recipe, 'outputGetter:getRollableResults', e);
    }

    return outputs;
}

function getNewRollableResults(recipe, knownItemIds) {
    let results = [];
    if (!recipe.getRollableResults) return results;

    try {
        toArray(recipe.getRollableResults()).forEach(result => {
            let extracted = safeExtractItem(result);
            if (!extracted) return;

            try {
                let itemId = String(extracted.stack.getItem().getId());
                if (!knownItemIds[itemId]) results.push(result);
            } catch (e) {
                logSkippedItem(result, 'getNewRollableResults:itemId', e);
            }
        });
    } catch (e) {
        logSkippedItem(recipe, 'getNewRollableResults', e);
    }

    return results;
}

function logSkippedItem(item, source, error) {
    try {
        let info = (item && item.getClass) ? item.getClass().getName() : typeof item;
        let value = 'n/a';
        try {
            value = String(item);
        } catch (ignored) {}
        let errMsg = (error && error.message) ? error.message : String(error);
        console.warn('[OneEnoughValue] Skipped in ' + source + ': ' + info + ' | ' + value + ' | ' + errMsg);
    } catch (e) {}
}

function calculateValueDistribution(items, itemCountMap, totalUnpricedCnt, consumedValue) {
    // 统计数量和已消耗的价值
    toArray(items).forEach(item => {
        let extracted = safeExtractItem(item);
        if (!extracted) return;

        try {
            let itemId = String(extracted.stack.getItem().getId());

            // 黑名单内的物品不参与价值分配
            if (global.ValueBlackList.indexOf(itemId) !== -1) return;

            let expectedCount = extracted.count * extracted.chance;
            itemCountMap[itemId] = (itemCountMap[itemId] || 0.0) + expectedCount;

            let definedValue = global.FoodIngredientValueDict.get(itemId);
            if (definedValue !== undefined) {
                consumedValue += definedValue * expectedCount;
            } else {
                totalUnpricedCnt += expectedCount;
            }
        } catch (e) {
            logSkippedItem(item, 'calculateValueDistribution:process', e);
        }
    });

    // 修复：确保返回对象的语法正确
    return {
        itemCountMap: itemCountMap,
        totalUnpricedCnt: totalUnpricedCnt,
        consumedValue: consumedValue
    };
}

function safeCallNoArg(target, methodName, source) {
    if (!target) return null;

    try {
        if (typeof target[methodName] === 'function') {
            return target[methodName]();
        }
    } catch (e) {
        logSkippedItem(target, source + ':' + methodName, e);
    }

    return null;
}

function getDefaultRecipeExtraValue(extraValueGetter, recipe) {
    try {
        if (!extraValueGetter) return 0;
        if (typeof extraValueGetter.get === 'function') return Number(extraValueGetter.get(recipe)) || 0;
        if (typeof extraValueGetter === 'function') return Number(extraValueGetter(recipe)) || 0;
    } catch (e) {
        logSkippedItem(recipe, 'extraValueGetter:default', e);
    }

    return 0;
}

function getFluidId(fluidStack) {
    if (!fluidStack) return null;

    try {
        if (fluidStack.id) return String(fluidStack.id);
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidId:id', e);
    }

    try {
        if (typeof fluidStack.getFluidStack === 'function') {
            let innerStack = fluidStack.getFluidStack();
            let innerId = getFluidId(innerStack);
            if (innerId) return innerId;
        }
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidId:getFluidStack', e);
    }

    try {
        if (typeof fluidStack.getFluid === 'function') {
            let fluid = fluidStack.getFluid();
            let fluidKey = global.CDLightmansCurrencyApi.ForgeRegistries.FLUIDS.getKey(fluid);
            if (fluidKey) return String(fluidKey);
        }
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidId:getFluid', e);
    }

    try {
        if (fluidStack.fluid) {
            let fluidKey = global.CDLightmansCurrencyApi.ForgeRegistries.FLUIDS.getKey(fluidStack.fluid);
            if (fluidKey) return String(fluidKey);
        }
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidId:fluid', e);
    }

    return null;
}

function getFluidAmount(fluidStack, fallbackAmount) {
    if (!fluidStack) return fallbackAmount || 1000;

    try {
        if (typeof fluidStack.getAmount === 'function') return Number(fluidStack.getAmount()) || fallbackAmount || 1000;
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidAmount:getAmount', e);
    }

    try {
        if (fluidStack.amount !== undefined) return Number(fluidStack.amount) || fallbackAmount || 1000;
    } catch (e) {
        logSkippedItem(fluidStack, 'getFluidAmount:amount', e);
    }

    return fallbackAmount || 1000;
}

function getFluidValuePer1000(fluidId) {
    if (!fluidId || !global.FluidIngredientValueDict) return 0;

    try {
        let value = global.FluidIngredientValueDict.get(fluidId);
        if (value !== undefined) return Number(value) || 0;
    } catch (e) {
        logSkippedItem(fluidId, 'getFluidValuePer1000', e);
    }

    return 0;
}

function calculateFluidStackValue(fluidId, amount) {
    let valuePer1000 = getFluidValuePer1000(fluidId);
    if (valuePer1000 <= 0 || amount <= 0) return 0;

    return valuePer1000 * amount / 1000.0;
}

function extractFluidCandidates(fluidIngredient) {
    let candidates = [];
    if (!fluidIngredient) return candidates;

    let fallbackAmount = getFluidAmount(fluidIngredient, 1000);

    try {
        let matchingStacks = safeCallNoArg(fluidIngredient, 'getMatchingFluidStacks', 'fluidIngredient');
        toArray(matchingStacks).forEach(stack => {
            let fluidId = getFluidId(stack);
            if (!fluidId) return;

            candidates.push({
                fluid: fluidId,
                amount: getFluidAmount(stack, fallbackAmount)
            });
        });
    } catch (e) {
        logSkippedItem(fluidIngredient, 'extractFluidCandidates:matchingStacks', e);
    }

    if (candidates.length === 0) {
        let fluidId = getFluidId(fluidIngredient);
        if (fluidId) {
            candidates.push({
                fluid: fluidId,
                amount: fallbackAmount
            });
        }
    }

    return candidates;
}

function calculateFluidIngredientValue(fluidIngredient) {
    let minValue = null;

    extractFluidCandidates(fluidIngredient).forEach(candidate => {
        let value = calculateFluidStackValue(candidate.fluid, candidate.amount);
        if (value <= 0) return;
        if (minValue === null || value < minValue) minValue = value;
    });

    return minValue || 0;
}

function getRecipeFluidIngredients(recipe) {
    let fluidIngredients = [];

    let addFluidIngredientValue = function (value) {
        if (!value) return;

        let values = toArray(value);
        if (values.length > 0) {
            values.forEach(fluidIngredient => fluidIngredients.push(fluidIngredient));
            return;
        }

        fluidIngredients.push(value);
    }

    addFluidIngredientValue(safeCallNoArg(recipe, 'getFluidIngredients', 'recipeFluidInput'));

    if (fluidIngredients.length === 0) {
        addFluidIngredientValue(safeCallNoArg(recipe, 'getFluidIngredient', 'recipeFluidInput'));
    }

    try {
        if (fluidIngredients.length === 0 && recipe.fluidIngredients) {
            addFluidIngredientValue(recipe.fluidIngredients);
        }
    } catch (e) {
        logSkippedItem(recipe, 'recipeFluidInput:field', e);
    }

    return fluidIngredients;
}

function calculateRecipeFluidInputValue(recipe) {
    let fluidValue = 0.0;

    getRecipeFluidIngredients(recipe).forEach(fluidIngredient => {
        try {
            fluidValue += calculateFluidIngredientValue(fluidIngredient);
        } catch (e) {
            logSkippedItem(fluidIngredient, 'calculateRecipeFluidInputValue', e);
        }
    });

    return fluidValue;
}

function calculateHiddenFluidRecipeValue(recipeTypeName) {
    if (!global.HiddenFluidCostByRecipeType) return 0;

    let hiddenFluids = global.HiddenFluidCostByRecipeType.get(recipeTypeName);
    if (!hiddenFluids) return 0;

    let hiddenValue = 0.0;
    toArray(hiddenFluids).forEach(fluidCost => {
        try {
            hiddenValue += calculateFluidStackValue(String(fluidCost.fluid), Number(fluidCost.amount) || 0);
        } catch (e) {
            logSkippedItem(fluidCost, 'calculateHiddenFluidRecipeValue', e);
        }
    });

    return hiddenValue;
}


OEVEvents.addRecipeHandler(event => {
    // 第一个参数为RecipeType，你可以使用字符串来代表
    // 也可以直接传入RecipeType实例

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
                let inputs = [];
                try {
                    let ingredients = recipe.getIngredients();
                    toArray(ingredients).forEach(i => inputs.push(i));

                    // 序列组装配方
                    if (recipe.getSequence) {
                        try {
                            // 添加起始原料，注意这里的方法和上面不是同一个（少个s）
                            let startIngredient = recipe.getIngredient();
                            if (startIngredient) inputs.push(startIngredient);
                        } catch (e) {
                            logSkippedItem(recipe, 'inputGetter:startIngredient', e);
                        }

                        try {
                            toArray(recipe.getSequence()).forEach(step => {
                                try {
                                    let stepRecipe = step.getRecipe();
                                    // 机械手配方不消耗手持物品时的特殊处理
                                    if (stepRecipe.shouldKeepHeldItem && stepRecipe.shouldKeepHeldItem()) return;

                                    let stepIngs = stepRecipe.getIngredients();
                                    if (stepIngs && stepIngs.size && stepIngs.size() == 2) {
                                        inputs.push(stepIngs.get(1));
                                    }
                                } catch (e) {
                                    logSkippedItem(step, 'inputGetter:sequenceStep', e);
                                }
                            });
                        } catch (e) {
                            logSkippedItem(recipe, 'inputGetter:sequence', e);
                        }
                    }
                } catch (e) {
                    logSkippedItem(recipe, 'inputGetter', e);
                }
                return inputs;
            },
            (recipe, registryAccess) => {
                try {
                    return getRecipeOutputStacks(recipe, registryAccess);
                } catch (e) {
                    logSkippedItem(recipe, 'outputGetter', e);
                    return [];
                }
            },
            (recipe) => {
                let extraValue = getDefaultRecipeExtraValue(event.defaultRecipeExtraValueGetter, recipe);
                extraValue += calculateRecipeFluidInputValue(recipe);
                extraValue += calculateHiddenFluidRecipeValue(typeName);
                return Math.ceil(extraValue);
            },
            // event.defaultRecipeValueSetter
            (recipe, stacks, totalValue, setter) => {
                try {
                    let currentTotalValue = totalValue * multiplier;

                    // 1. 初始化变量
                    let itemCountMap = {};
                    let totalUnpricedCnt = 0.0;
                    let consumedValue = 0.0;

                    let stacksArr = toArray(stacks);
                    let rollableResults = null;
                    let stackItemIds = collectItemIds(stacksArr);

                    // 2. 先计算 stacks 中的物品价值分配
                    let stacksResult = calculateValueDistribution(stacksArr, itemCountMap, totalUnpricedCnt, consumedValue);
                    itemCountMap = stacksResult.itemCountMap;
                    totalUnpricedCnt = stacksResult.totalUnpricedCnt;
                    consumedValue = stacksResult.consumedValue;

                    // 3. 如果是机械动力概率产出，补充计算 序列组装的产出物 中的物品价值分配
                    if (recipe.getRollableResults) {
                        try {
                            rollableResults = getNewRollableResults(recipe, stackItemIds);
                            let rollableResult = calculateValueDistribution(rollableResults, itemCountMap, totalUnpricedCnt, consumedValue);
                            itemCountMap = rollableResult.itemCountMap;
                            totalUnpricedCnt = rollableResult.totalUnpricedCnt;
                            consumedValue = rollableResult.consumedValue;
                        } catch (e) {
                            logSkippedItem(recipe, 'valueSetter:getRollableResults', e);
                            rollableResults = null;
                        }
                    }

                    // 4. 计算未定价物品的单价
                    let valuePerUnpricedUnit = 1;
                    if (currentTotalValue > 0 && totalUnpricedCnt > 0) {
                        let remainingValue = currentTotalValue - consumedValue;
                        valuePerUnpricedUnit = Math.max(1, remainingValue / totalUnpricedCnt);
                    }

                    // 5. 统一设置价值
                    // 设置 stacks 中的物品价值
                    let processedIds = {};
                    stacksArr.forEach(stack => {
                        try {
                            if (!stack || stack.isEmpty() || stack.getCount() <= 0) return;

                            let itemId = String(stack.getItem().getId());
                            processedIds[itemId] = true;

                            if (global.ValueBlackList.indexOf(itemId) !== -1) return;

                            if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                                let stackValue = valuePerUnpricedUnit * stack.getCount();
                                setter.set(recipe, stack, stackValue);
                            }
                        } catch (e) {
                            logSkippedItem(stack, 'valueSetter:stacks', e);
                        }
                    });

                    // 设置 rollableResults 中的物品价值
                    if (rollableResults) {
                        toArray(rollableResults).forEach(result => {
                            let extracted = safeExtractItem(result);
                            if (!extracted) return;

                            try {
                                let itemId = String(extracted.stack.getItem().getId());

                                // 黑名单内的物品不参与价值分配
                                if (global.ValueBlackList.indexOf(itemId) !== -1) return;

                                if (global.FoodIngredientValueDict.get(itemId) === undefined) {
                                    // 检查该物品是否已经在 stacks 中处理过
                                    if (!processedIds[itemId]) {
                                        setter.set(recipe, Item.of(itemId), valuePerUnpricedUnit);
                                    }
                                }
                            } catch (e) {
                                logSkippedItem(result, 'valueSetter:rollable:set', e);
                            }
                        });
                    }
                } catch (e) {
                    logSkippedItem(recipe, 'valueSetter:fatal', e);
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
