ServerEvents.recipes(e => {
    remove_recipes_input(e, [
        'vinery:cherry_boat'
    ])
    remove_recipes_output(e, [
        'vinery:grapevine_stem',
        'nethervinery:obsidian_stem',
        'vinery:cherry_boat'
    ])
})
BlockEvents.rightClicked('vinery:grapevine_pot', e => {
    const { player, level } = e
    if (player.mainHandItem == 'nethervinery:crimson_grape' | player.mainHandItem == 'nethervinery:warped_grape'){
        e.cancel()
    }
})