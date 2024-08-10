ServerEvents.recipes(e => {
    let recipes = [
        ['4x createdelight:oatmeal_cookie_dough', 'vintagedelight:raw_oats']
    ]
    recipes.forEach(([result, input]) => {
        e.recipes.create.mixing(
            result,
            [
                input,
                "minecraft:sugar",
                'createdelight:butter',
                '2x create:wheat_flour',
                Fluid.of("ratatouille:egg_yolk", 50)
            ]
        ).id(`createdelight:mixing/${result.split(":")[1]}_1`)    
    });
    recipes.forEach(([result, input]) => {
        e.recipes.create.mixing(
            result,
            [
                input,
                Fluid.of("create:honey", 50),
                'createdelight:butter',
                '2x create:wheat_flour',
                Fluid.of("ratatouille:egg_yolk", 50)
            ]
        ).id(`createdelight:mixing/${result.split(":")[1]}_2`)    
    });

})