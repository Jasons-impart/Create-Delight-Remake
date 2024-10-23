ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.filling("ends_delight:raw_dragon_meat", ["#createdelight:dragon_flesh", Fluid.of("create_central_kitchen:dragon_breath", 250)])
})