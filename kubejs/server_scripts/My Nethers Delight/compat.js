ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mynethersdelight:cutting/ghasmati",
        "mynethersdelight:cutting/minced_strider"
    ])
    cutting_3(e, "mynethersdelight:ghasta", [
        ["mynethersdelight:ghasmati"],
        ["mynethersdelight:ghasmati", 1, 0.05]
    ])
    cutting_3(e, "mynethersdelight:strider_slice", [
        ["mynethersdelight:minced_strider", 2],
        ["minecraft:string"],
        ["minecraft:string", 2, 0.5]
    ])
})
