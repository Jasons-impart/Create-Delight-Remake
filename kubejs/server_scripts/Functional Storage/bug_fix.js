ServerEvents.recipes(e => {
    // remove_recipes_id(e, [
    //     "functionalstorage:simple_compacting_drawer",
    //     "functionalstorage:framed_simple_compacting_drawer"
    // ])
})
ServerEvents.tags("block", e => {
    e.add('create:non_movable', [
        "functionalstorage:storage_controller",
        "functionalstorage:framed_storage_controller"
    ])
})
