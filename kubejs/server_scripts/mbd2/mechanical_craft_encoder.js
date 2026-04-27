const $BigItemStack = Java.loadClass("com.simibubi.create.content.logistics.BigItemStack")
const $PackageOrderWithCrafts = Java.loadClass("com.simibubi.create.content.logistics.stockTicker.PackageOrderWithCrafts")
const $MechanicalCraftingRecipe = Java.loadClass("com.simibubi.create.content.kinetics.crafter.MechanicalCraftingRecipe")
const $ItemStackHandler = Java.loadClass("net.minecraftforge.items.ItemStackHandler")
const $PackageItem = Java.loadClass("com.simibubi.create.content.logistics.box.PackageItem")
MBDMachineEvents.onLoad("createdelight:mechanical_craft_encoder", e => {
    let event = e.event
    const { machine } = event
    const { customData } = machine


    /**@type {ItemStackTransfer} */
    let input = machine.getTraitByName("item_input_slot").storage
    input.setOnContentsChanged(() => {
        customData.putInt("handle_countdown", 30)
    })
})

/**
* 
* @param {Internal.MBDMachine} machine 
* @param {Internal.Level} level 
*/
function handleChanged(machine, level) {
    /**@type {ItemStackTransfer} */
    let input = machine.getTraitByName("item_input_slot").storage

    /**@type {ItemStackTransfer} */
    let filter = machine.getTraitByName("item_filter_slot").storage
    /**@type {ItemStackTransfer} */
    let output = machine.getTraitByName("item_output_slot").storage
    let outputFull = true
    for (let index = 0; index < output.slots; index++) {
        let element = output.getStackInSlot(index);
        if (element.empty)
            outputFull = false
    }
    if (outputFull)
        return
    let minWidth = machine.customData.getInt("width") || 5

    /**@type {Internal.MechanicalCraftingRecipe[]} */
    let recipelist = level.recipeManager.getAllRecipesFor("create:mechanical_crafting")
        .filter(recipe => {
            if (filter.getStackInSlot(0).empty)
                return true
            else
                return recipe.getResultItem(level.registryAccess()).is(filter.getStackInSlot(0))
        })
        .filter(recipe => {
            let snapshot = input.createSnapshot()  // 保存当前状态

            // 遍历配方中的每个食材
            let allIngredientsConsumed = true; // 假设所有食材都能消耗完
            for (let i = 0; i < recipe.ingredients.size(); i++) {
                let ingr = recipe.ingredients.get(i);  // 获取当前配方中的食材

                // 如果食材是空的，跳过
                if (ingr.empty) continue;

                // 遍历input中的每个槽位，检查是否有匹配的物品
                let ingredientConsumed = false;
                for (let j = 0; j < input.slots; j++) {
                    let inputStack = input.getStackInSlot(j)

                    if (!inputStack.empty && ingr.test(inputStack.id)) {
                        // 获取食材的数量
                        let countToExtract = ingr.getFirst().getCount();
                        let res = input.extractItem(j, countToExtract, false, false);

                        // 如果成功提取物品，减少该食材数量
                        if (res.count > 0) {
                            ingredientConsumed = true;
                        }
                        break; // 一旦消耗了匹配的食材，跳出内层循环
                    }
                }

                // 如果某个食材无法消耗完，则返回false
                if (!ingredientConsumed) {
                    allIngredientsConsumed = false;
                    break;
                }
            }

            // 恢复input状态
            input.restoreFromSnapshot(snapshot);
            return allIngredientsConsumed;  // 如果所有食材都已成功消耗，返回true
        })
    recipelist
    .filter(recipe => {
        return recipe.width <= minWidth
    })
    .sort((a, b) => {
        return Math.abs(a.width - minWidth) - Math.abs(b.width - minWidth) //越接近所设置宽度值的越在前面
    })


    if (recipelist.length !== 0) {
        // 获取recipe的宽度和高度
        let width = recipelist[0].width;
        let height = recipelist[0].height;

        // 模拟空食材
        let emptyIngredient = Item.empty; // Empty ItemStack
        let craftingIngredients = Utils.newList();

        // 获取设定的最小宽度（确保它至少等于配方的宽度）
        let gridWidth = Math.max(minWidth, width);  // 如果设定的宽度小于配方的宽度，取配方的宽度

        let resultItemHandler = new $ItemStackHandler()
        resultItemHandler.setSize(81)
        // 按照设定的宽度填充craftingIngredients
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < gridWidth; j++) {
                if (j < width) {
                    // 处于配方区域，添加食材
                    let ingredient = recipelist[0].ingredients.get(i * width + j);  // 计算配方食材的索引
                    let craftingIngredient = emptyIngredient;

                    if (!ingredient.isEmpty()) {
                        // 在input中寻找对应的物品
                        for (let k = 0; k < input.slots; k++) {
                            let inputStack = input.getStackInSlot(k);
                            if (!inputStack.empty && ingredient.test(inputStack)) {
                                craftingIngredient = inputStack.copyWithCount(1);  // 复制食材
                                resultItemHandler.insertItem(craftingIngredient, false)
                                inputStack.shrink(1);  // 从input中消耗该物品
                                break;
                            }
                        }
                    }
                    craftingIngredients.push(new $BigItemStack(craftingIngredient));
                } else {
                    // 超过配方区域，填充空食材
                    craftingIngredients.push(new $BigItemStack(emptyIngredient));
                }
            }
        }

        // 保证craftingIngredients长度为9
        while (craftingIngredients.length < 9) {
            craftingIngredients.push(new $BigItemStack(emptyIngredient));
        }

        let order = $PackageOrderWithCrafts.singleRecipe(craftingIngredients);

        // 移除input内的对应配方所应该消耗的内容
        // recipelist[0].ingredients.forEach((ingredient) => {
        //     for (let i = 0; i < input.slots; i++) {
        //         let inputStack = input.getStackInSlot(i);
        //         if (!inputStack.empty && !ingredient.empty && ingredient.test(inputStack)) {
        //             let countToExtract = ingredient.first.count;
        //             let res = input.extractItem(i, countToExtract, false, false);
        //             console.log(res)
        //             list.push(res);
        //             break;
        //         }
        //     }
        // });
        let pack = $PackageItem["containing(net.minecraftforge.items.ItemStackHandler)"](resultItemHandler);
        pack.nbt.put("Fragment", { OrderContext: order.write() });
        ItemTransferHelper.insertItemStacked(output, pack, false);
    }


}

MBDMachineEvents.onTick("createdelight:mechanical_craft_encoder", e => {
    let event = e.event
    const { machine } = event
    const { level, customData } = machine

    // if (customData.getInt("handle_countdown") == 1) {
    //     handleChanged(machine, level)
    // }

    // if (customData.getInt("handle_countdown") > 0) {
    //     customData.putInt("handle_countdown", customData.getInt("handle_countdown") - 1)
    // }

    if (level.time % 30 == 0 && level.hasNeighborSignal(machine.pos))
        handleChanged(machine, level)
})


MBDMachineEvents.onNeighborChanged("createdelight:mechanical_craft_encoder", e => {

    let event = e.event
    const { machine } = event
    const { level, customData } = machine
    if (level.hasNeighborSignal(machine.pos))
        handleChanged(machine, level)
})
MBDMachineEvents.onUI("createdelight:mechanical_craft_encoder", e => {
    let event = e.event
    const { machine, root } = event
    /**@type {TextFieldWidget} */
    let text = root.getFirstWidgetById("width")
    text.currentString = (machine.customData.getInt("width") || 5).toFixed()
    text.setNumbersOnlyInt(1, 9)
    text.setTextResponder(str => {
        machine.customData.putInt("width", parseInt(str))
    })

})