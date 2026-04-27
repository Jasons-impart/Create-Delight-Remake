ServerEvents.tags("item", e => {
    e.add("forge:fruits/grape", [
        "vinery:red_grape",
        "vinery:white_grape",
        "vinery:savanna_grapes_red",
        "vinery:savanna_grapes_white",
        "vinery:taiga_grapes_red",
        "vinery:taiga_grapes_white",
        "vinery:jungle_grapes_red",
        "vinery:jungle_grapes_white",
        "nethervinery:warped_grape",
        "nethervinery:crimson_grape",
    ])
    e.add("forge:fruits/cherry", [
        "vinery:cherry",
    ])
})
ServerEvents.recipes(e => {
    e.remove({type: "create:filling", input: "vinery:wine_bottle"})
    e.remove({type: "create:emptying", output: "vinery:wine_bottle"})
    let grape_list = [
        ["vinery:red_grape", "vinery:red_grapejuice", "createdelightcore:red_grapejuice"],
        ["vinery:jungle_grapes_red", "vinery:red_jungle_grapejuice", "createdelightcore:jungle_red_grapejuice"],
        ["vinery:savanna_grapes_red", "vinery:red_savanna_grapejuice", "createdelightcore:savanna_red_grapejuice"],
        ["vinery:taiga_grapes_red", "vinery:red_taiga_grapejuice", "createdelightcore:taiga_red_grapejuice"],
        ["vinery:white_grape", "vinery:white_grapejuice", "createdelightcore:white_grapejuice"],
        ["vinery:jungle_grapes_white", "vinery:white_jungle_grapejuice", "createdelightcore:jungle_white_grapejuice"],
        ["vinery:savanna_grapes_white", "vinery:white_savanna_grapejuice", "createdelightcore:savanna_white_grapejuice"],
        ["vinery:taiga_grapes_white", "vinery:white_taiga_grapejuice", "createdelightcore:taiga_white_grapejuice"],
        ["nethervinery:warped_grape", "nethervinery:warped_grapejuice", "createdelightcore:warped_grapejuice"],
        ["nethervinery:crimson_grape", "nethervinery:crimson_grapejuice", "createdelightcore:crimson_grapejuice"]
    ]
    grape_list.forEach(grape => {
        e.recipes.create.mixing(Fluid.of(grape[2], 250),grape[0])
        .id(`createdelight:mixing/${grape[2].split(":")[1]}`)
        e.recipes.create.filling(grape[1], ["vinery:wine_bottle", Fluid.of(grape[2], 250)])
        .id(`createdelight:filling/${grape[2].split(":")[1]}`)
        e.recipes.create.emptying(["vinery:wine_bottle", Fluid.of(grape[2], 250)], grape[1])
        .id(`createdelight:emptying/${grape[1].split(":")[1]}`)
        pouring(e, grape[1], grape[2], "vinery:wine_bottle")
    })
})
