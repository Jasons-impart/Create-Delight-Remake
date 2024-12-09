ServerEvents.recipes(e => {
    
    const { create, vintageimprovements, createmetallurgy } = e.recipes
    e.forEachRecipe({ input: "#minecraft:logs", type: "create:cutting", output: "@createbigcannons" }, recipe => {
        let id = recipe.getId()
        remove_recipes_id(e, [id])
        vintageimprovements.turning(recipe.getOriginalRecipeResult(), recipe.getOriginalRecipeIngredients())
            .id(`createbigcannons:turning/${id.split("/")[1]}`)
    })
    let metal_list = [
        "steel",
        "nethersteel",
        "bronze",
        "cast_iron"]
    let molten_metal_list = [
        "createmetallurgy:molten_steel",
        "createbigcannons:molten_nethersteel",
        "createmetallurgy:molten_bronze",
        "createbigcannons:molten_cast_iron"]
    let cast_mould_layer_list = [
            [630, "very_small", 0, 1],
            [810, "small", 0, 1],
            [1080, "medium", 0, 1],
            [1260, "large", 0, 1],
            [1800, "very_large", 0, 1]
    ]
    let cast_mould_unbored_list = [
        [810, "sliding_breech", 0, 2, 3],
        [810, "screw_breech", 0, 1],
        [360, "autocannon_breech", 0, 2, 3],
        [360, "autocannon_recoil_spring", 0, 2, 3],
        [270, "autocannon_barrel", 0, 2, 3]
    ]

    let cast_mould_cannon_end_list = [
        [810, "cannon_end", 2, 3]
    ]
    let cast_mould_barriel_list = [
        [630, "very_small", 2, 3],
    ]
    let cast_mould_chamber_list = [
        [630, "medium", 2, 3],
    ]
    cast_mould_layer_list.forEach(list => {
        let amount = list[0]
        let cast_mould = list[1]
        for (let index = 2; index < list.length; index++) {
            let metal_index = list[index]

            createmetallurgy.casting_in_basin(`createbigcannons:unbored_${cast_mould}_${metal_list[metal_index]}_cannon_layer`,
                [Fluid.of(molten_metal_list[metal_index], amount), `createbigcannons:${cast_mould}_cast_mould`], 4800, true)
                .id(`createbigcannons:casting_in_basin/unbored_${cast_mould}_${metal_list[metal_index]}_cannon_layer`)
                
            vintageimprovements.turning(`createbigcannons:${cast_mould}_${metal_list[metal_index]}_cannon_layer`,
                `createbigcannons:unbored_${cast_mould}_${metal_list[metal_index]}_cannon_layer`)
                .id(`createbigcannons:turning/${cast_mould}_${metal_list[metal_index]}_cannon_layer`)
        }
    })
    
    cast_mould_barriel_list.forEach(list => {
        let amount = list[0]
        let cast_mould = list[1]
        for (let index = 2; index < list.length; index++) {
            let metal_index = list[index]

            createmetallurgy.casting_in_basin(`createbigcannons:unbored_${metal_list[metal_index]}_cannon_barrel`,
                [Fluid.of(molten_metal_list[metal_index], amount), `createbigcannons:${cast_mould}_cast_mould`], 4800, true)
                .id(`createbigcannons:casting_in_basin/unbored_${cast_mould}_${metal_list[metal_index]}_cannon_barrel`)
            
            vintageimprovements.turning(`createbigcannons:${metal_list[metal_index]}_cannon_barrel`,
                `createbigcannons:unbored_${metal_list[metal_index]}_cannon_barrel`)
                .id(`createbigcannons:turning/${metal_list[metal_index]}_cannon_barrel`)
        }
    })

    cast_mould_chamber_list.forEach(list => {
        let amount = list[0]
        let cast_mould = list[1]
        for (let index = 2; index < list.length; index++) {
            let metal_index = list[index]

            createmetallurgy.casting_in_basin(`createbigcannons:unbored_${metal_list[metal_index]}_cannon_chamber`,
                [Fluid.of(molten_metal_list[metal_index], amount), `createbigcannons:${cast_mould}_cast_mould`], 4800, true)
                .id(`createbigcannons:casting_in_basin/unbored_${cast_mould}_${metal_list[metal_index]}_cannon_chamber`)

            vintageimprovements.turning(`createbigcannons:${metal_list[metal_index]}_cannon_chamber`,
                `createbigcannons:unbored_${metal_list[metal_index]}_cannon_chamber`)
                .id(`createbigcannons:turning/${metal_list[metal_index]}_cannon_chamber`)
        }
    })

    cast_mould_unbored_list.forEach(list => {
        let amount = list[0]
        let cast_mould = list[1]
        for (let index = 2; index < list.length; index++) {
            let metal_index = list[index]

            createmetallurgy.casting_in_basin(`createbigcannons:unbored_${metal_list[metal_index]}_${cast_mould}`,
                [Fluid.of(molten_metal_list[metal_index], amount), `createbigcannons:${cast_mould}_cast_mould`], 3600, true)
                .id(`createbigcannons:casting_in_basin/unbored_${metal_list[metal_index]}_${cast_mould}`)
            if (cast_mould != "autocannon_barrel")
                vintageimprovements.turning(`createbigcannons:incomplete_${metal_list[metal_index]}_${cast_mould}`,
                    `createbigcannons:unbored_${metal_list[metal_index]}_${cast_mould}`)
                    .id(`createbigcannons:turning/incomplete_${metal_list[metal_index]}_${cast_mould}`)
            else 
                vintageimprovements.turning(`createbigcannons:${metal_list[metal_index]}_${cast_mould}`,
                    `createbigcannons:unbored_${metal_list[metal_index]}_${cast_mould}`)
                    .id(`createbigcannons:turning/${metal_list[metal_index]}_${cast_mould}`)
        }
    })

    cast_mould_cannon_end_list.forEach(list => {
        let amount = list[0]
        let cast_mould = list[1]
        for (let index = 2; index < list.length; index++) {
            let metal_index = list[index]

            createmetallurgy.casting_in_basin(`createbigcannons:${metal_list[metal_index]}_${cast_mould}`,
                [Fluid.of(molten_metal_list[metal_index], amount), `createbigcannons:${cast_mould}_cast_mould`], 2400, true)
                .id(`createbigcannons:casting_in_basin/${metal_list[metal_index]}_${cast_mould}`)
        }

    })
})