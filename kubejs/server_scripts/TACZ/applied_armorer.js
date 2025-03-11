ServerEvents.recipes(e => {
    const { kubejs } = e.recipes
    /**
     * 
     * @param {OutputItem_} result 
     * @param {InputItem_?} top 
     * @param {InputItem_?} middle 
     * @param {InputItem_?} bottom 
     * @returns 
     */
    let custom_inscribe = (result, top, middle, bottom) => {
        top = Ingredient.of(top || "minecraft:air")
        middle = Ingredient.of(middle || "minecraft:air")
        bottom = Ingredient.of(bottom || "minecraft:air")
        result = Item.of(result || "minecraft:air")
        return e.custom({
            type: "ae2:inscriber",
            ingredients: {
                top: top,
                middle: middle,
                bottom: bottom,
            },
            mode: "inscribe",
            result: result,
        })
    }
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}'), 
    [
        "AAA",
        "ABA",
        "AAA"
    ], {
        A: "#forge:ingots/iron",
        B: "protection_pixel:reinforcedfiber"
    }).id("applied_armorer:bracelet_niklas")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_aerial_wristband"}'),
        "createdelight:phase_transition_iron", 
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:bracelet_niklas"}').strongNBT(),
        "#forge:ingots/electrum"
    ).id("applied_armorer:bracelet_aerial_wristband")
})