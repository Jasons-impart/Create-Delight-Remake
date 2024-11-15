ServerEvents.recipes(e => {
    remove_recipes_input(e, [
        "vinery:cherry_boat"
    ])
    remove_recipes_output(e, [
        "vinery:cherry_boat"
    ])
    e.remove({mod: "vinery", type: "create:mixing"})
    e.remove({mod: "vinery", type: "create:compacting"})
})
