MBDMachineEvents.onAfterRecipeModify("createdelight:contract_executor", e => {
    let event = e.event
    const {machine, recipe} = event
    const {pos, level, customData} = machine
    let positions = [pos.north(), pos.south(), pos.west(), pos.east()]
    let heat = 0
    let count = 0
    positions.forEach(pos => {
        let block = level.getBlock(pos)
        if (block.id == "create:blaze_burner") {
            count++
            let blaze = block.properties.get("blaze")
            if (blaze == "kindled")
                heat += 2
            else if (blaze == "seething")
                heat += 3
            else
                heat += 1
        }
    })
    if (count == 0)
        event.setCanceled(true)
    let multipler = heat / Math.sqrt(count)
    let newRecipe = recipe.copy()
    newRecipe.duration /= multipler
    event.setRecipe(newRecipe)
    customData.putInt("blazeBurnerCount", count)
})

MBDMachineEvents.onUI("createdelight:contract_executor", e => {
    let event = e.event
    const {machine, root} = event
    let text = root.getFirstWidgetById("blaze_burner_count")
    
    text.setTextProvider(() => Component.translate("message.createdelight.blaze_burner_count",
        machine.customData.getInt("blazeBurnerCount").toFixed(0)))
})