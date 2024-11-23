ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    remove_recipes_id(e , [
        "createcafe:mixing/sugar_melting"
    ])
    create.mixing(Fluid.of("createcafe:melted_sugar", 125), "minecraft:sugar")
    .heated()
    .id("createcafe:mixing/sugar_melting")

    vintageimprovements.vacuumizing("minecraft:sugar", Fluid.of("createcafe:melted_sugar", 125))
    .id("createcafe:vacuumizing/melted_sugar_vacuumizing")
})