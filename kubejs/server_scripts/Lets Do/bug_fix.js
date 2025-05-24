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
        ["vinery:red_grapejuice", "doaddonfluids:red_grapejuice"],
        ["vinery:red_jungle_grapejuice", "doaddonfluids:jungle_red_grapejuice"],
        ["vinery:red_savanna_grapejuice", "doaddonfluids:savanna_red_grapejuice"],
        ["vinery:red_taiga_grapejuice", "doaddonfluids:taiga_red_grapejuice"],
        ["vinery:white_grapejuice", "doaddonfluids:white_grapejuice"],
        ["vinery:white_jungle_grapejuice", "doaddonfluids:jungle_white_grapejuice"],
        ["vinery:white_savanna_grapejuice", "doaddonfluids:savanna_white_grapejuice"],
        ["vinery:white_taiga_grapejuice", "doaddonfluids:taiga_white_grapejuice"],
        ["nethervinery:warped_grapejuice", "doaddonfluids:warped_grapejuice"],
        ["nethervinery:crimson_grapejuice", "doaddonfluids:crimson_grapejuice"]
    ]
    grape_list.forEach(grape => {
        e.recipes.create.filling(grape[0], ["vinery:wine_bottle", Fluid.of(grape[1], 250)])
        .id(`doaddonfluids:filling/${grape[1].split(":")[1]}`)
        e.recipes.create.emptying(["vinery:wine_bottle", Fluid.of(grape[1], 250)], grape[0])
        .id(`doaddonfluids:emptying/${grape[0].split(":")[1]}`)
        pouring(e, grape[0], grape[1], "vinery:wine_bottle")
    })
})
