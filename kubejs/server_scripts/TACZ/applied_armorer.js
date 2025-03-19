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
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_double_sided_mirror"}'), [
        "A A",
        "BCB"
    ], {
        A: "ae2:quartz_glass",
        B: "megacells:sky_steel_ingot",
        C: "ae2:fluix_crystal"
    })
    .id("applied_armorer:si_double_sided_mirror")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_profession"}'), [
        "A  ",
        "BBB"
    ], {
        A: "ae2:quartz_glass",
        B: "megacells:sky_steel_ingot"
    })
    .id("applied_armorer:si_profession")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:scope_xgs_905"}'), [
        "AAA",
        "B B",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass"
    })
    .id("applied_armorer:scope_xgs_905")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_simple_3"}'), [
        " A ",
        " B ",
        " A "
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass"
    })
    .id("applied_armorer:si_simple_3")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:sight_type_3741"}'), [
        "ABA",
    ], {
        A: "megacells:sky_steel_ingot",
        B: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_simple_3"}').strongNBT()
    })
    .id("applied_armorer:sight_type_3741")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_ms_12"}'), [
        " A ",
        "BCB",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:sight_type_3741"}').strongNBT()
    })
    .id("applied_armorer:scope_ms_12")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:scope_ms_14"}'), [
        "AAA",
        "BCB",
        "AAA"
    ], {
        A: "megacells:sky_steel_ingot",
        B: "ae2:quartz_glass",
        C: Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:si_ms_12"}').strongNBT()
    })
    .id("applied_armorer:scope_ms_14")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_ns_1"}'), [
        "AAA",
        "B B",
        "AAA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    })
    .id("applied_armorer:muzzle_ns_1")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firefly"}'),
        "ae2:calculation_processor",
        "#forge:plates/iron",
        "ae2:logic_processor"
    ).id("applied_armorer:muzzle_chip_firefly")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_pcs_x1"}'),
        "ae2:speed_card",
        "createdelight:forged_steel_sheet",
        "ae2:calculation_processor"
    ).id("applied_armorer:muzzle_chip_pcs_x1")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_atm_x2"}'),
        "ae2:speed_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_pcs_x1"}').strongNBT(),
        "ae2:engineering_processor"
    ).id("applied_armorer:muzzle_chip_pcs_x1")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firework"}'),
        "ae2:energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firefly"}').strongNBT(),
        "ae2:energy_cell"
    ).id("applied_armorer:muzzle_chip_firework")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_hyper_propellant"}'),
        "ae2:energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_firework"}').strongNBT(),
        "ae2:dense_energy_cell"
    ).id("applied_armorer:muzzle_chip_hyper_propellant")
    custom_inscribe(
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_fat_boy"}'),
        "megacells:greater_energy_card",
        Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_chip_hyper_propellant"}').strongNBT(),
        "megacells:mega_energy_cell"
    ).id("applied_armorer:muzzle_chip_fat_boy")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_commander"}'), [
        "AAA",
        "   ",
        "BAA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    }).id("applied_armorer:muzzle_commander")
    kubejs.shaped(Item.of('tacz:attachment', '{AttachmentId:"applied_armorer:muzzle_bs_mod4"}'), [
        "ABA",
        "   ",
        "ABA"
    ], {
        A: "#forge:rods/iron",
        B: "#forge:nuggets/iron"
    }).id("applied_armorer:muzzle_bs_mod4")
    
})