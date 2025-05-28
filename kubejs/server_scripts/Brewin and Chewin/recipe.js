ServerEvents.recipes(e => {
    const {createdieselgenerators, create, vintagedelight} = e.recipes
    remove_recipes_id(e, [
        "brewinandchewin:filling/create/unripe_flaxen_cheese_wheel",
        "brewinandchewin:cutting/flaxen_cheese_wheel",
        "brewinandchewin:fermenting/jerky",
        "brewinandchewin:emptying/create/honey_bottle",
        "brewinandchewin:filling/create/honey_bottle"
    ])
    e.replaceOutput({}, "brewinandchewin:flaxen_cheese_wedge", "ad_astra:cheese")
    e.replaceInput({not: [{id: "brewinandchewin:flaxen_cheese_wheel_from_wedges"}]}, "brewinandchewin:flaxen_cheese_wedge", "#forge:cheese")
    e.replaceInput({id: "brewinandchewin:flaxen_cheese_wheel_from_wedges"}, "brewinandchewin:flaxen_cheese_wedge", "ad_astra:cheese")
    e.replaceInput({}, "#brewinandchewin:cheese_wedges", "#forge:cheese")
    create.filling("brewinandchewin:unripe_flaxen_cheese_wheel", [
        "minecraft:honeycomb",
        Fluid.of("create_bic_bit:curdled_milk", 1000)
    ])
    .id("brewinandchewin:filling/create/unripe_flaxen_cheese_wheel")
    cutting_2(e, "brewinandchewin:flaxen_cheese_wheel", [
        ["ad_astra:cheese", 4]
    ])
    vintagedelight.fermenting("2x brewinandchewin:pickled_pickles",[
        "#forge:sea_pickles",
        "#forge:sea_pickles",
        "minecraft:honey_bottle"
    ], 2500)

    .id("brewinandchewin:fermenting/pickled_pickles")
})