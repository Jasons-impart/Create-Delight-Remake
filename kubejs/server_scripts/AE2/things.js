ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    let count = 1
    for (let index = 0; index < 5; index++) {
        remove_recipes_id(e, [`ae2things:cells/disk_drive_${count}k`])
        count *= 4
    }
    remove_recipes_id(e, ["ae2things:cells/disk_housing"])
    create.deploying("ae2things:disk_housing", ["ae2:item_cell_housing", "art_of_forging:encoded_canister"])
    .id("ae2things:deploying/disk_housing")
    kubejs.shapeless("ae2things:disk_housing", ["ae2:item_cell_housing", "art_of_forging:encoded_canister"])
    .id("ae2things:disk_housing")
})