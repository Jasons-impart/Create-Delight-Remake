ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    remove_recipes_id(e, [
        "neapolitan:vanilla/vanilla_ice_cream",
        "neapolitan:chocolate/chocolate_ice_cream",
        "neapolitan:strawberry/strawberry_ice_cream",
        "neapolitan:banana/banana_ice_cream",
        "neapolitan:mint/mint_ice_cream",
        "neapolitan:adzuki/adzuki_ice_cream",
        "collectorsreap:food/pomegranate_ice_cream",
        "collectorsreap:food/lime_ice_cream",
        "brewinandchewin:filling/create/milk_bottle",
        "neapolitan:vanilla/vanilla_ice_cream_block",
        "neapolitan:chocolate/chocolate_ice_cream_block",
        "neapolitan:mixed/neapolitan_ice_cream",
        "neapolitan:mixed/neapolitan_ice_cream_from_vanilla",
        "alexscaves:vanilla_ice_cream",
        "alexscaves:chocolate_ice_cream",
        "neapolitan:strawberry/strawberry_ice_cream_block",
        "neapolitan:banana/banana_ice_cream_block",
        "neapolitan:mint/mint_ice_cream_block",
        "neapolitan:adzuki/adzuki_ice_cream_block",
        "collectorsreap:lime_ice_cream_block",
        "collectorsreap:pomegranate_ice_cream_block",
        "alexscaves:sweetberry_ice_cream",
    ])
/**
 * 
 * @param {Internal.RecipesEventJS} e 
 * @param {InputItem_} ingredient 
 * @param {Internal.FluidStackJS_} outputFluidIcecrem 
 * @param {Internal.FluidStackJS_} outputFluidMilkshake
 * @param {Internal.ItemStack_} icecreamscoop
 * @param {Internal.ItemStack_} icecream 
 * @param {Internal.ItemStack_} milkshake 
 */
function make_ice_cream(e, ingredient, outputFluidIcecream, outputFluidMilkshake, icecreamscoop, icecream, milkshake, icecreamblock) {
    create.mixing(
        Fluid.of(outputFluidIcecream, 250), 
        [
            ingredient, 
            Fluid.of("createdelight:whipped_cream", 250), 
            Fluid.of("createcafe:melted_sugar", 250)
        ]
    ).heatRequirement("cooled").id(`createdelight:mixing/${outputFluidIcecream.split(":")[1]}`)
    create.mixing(
        icecreamscoop,
        Fluid.of(outputFluidIcecream, 250)
    ).heatRequirement("frozen").id(`createdelight:mixing/${icecreamscoop.split(":")[1]}`)
    kubejs.shapeless(
       icecreamblock,
       [
            icecreamscoop,
            icecreamscoop,
            icecreamscoop,
            icecreamscoop,
       ]
    ).id(`createdelight:storage/${icecreamblock.split(":")[1]}`)
    create.deploying(
        icecream,
        [
            "minecraft:bowl",
            icecreamscoop
        ]
    ).id(`createdelight:deploying/${icecream.split(":")[1]}`)
    kubejs.shapeless(
        icecream,
        [
            "minecraft:bowl",
            icecreamscoop
        ]
    ).id(`createdelight:shapeless/${icecream.split(":")[1]}`)
    kubejs.shapeless(
            icecreamscoop,
        icecream
    ).replaceIngredient(icecream, "minecraft:bowl").id(`createdelight:shapeless/${icecreamscoop.split(":")[1]}`)
    create.mixing(
        Fluid.of(outputFluidMilkshake, 750),
        [
            Fluid.of(outputFluidIcecream, 250),
            Fluid.of("minecraft:milk", 500)
        ]
    ).id(`createdelight:mixing/${outputFluidMilkshake.split(":")[1]}`)
    create.filling(
        milkshake,
        [
            "minecraft:glass_bottle",
            Fluid.of(outputFluidMilkshake, 250)
        ]
    ).id(`createdelight:filling/${milkshake.split(":")[1]}`)
    create.emptying(
        [
            Fluid.of(outputFluidMilkshake, 250),
            "minecraft:glass_bottle"
        ], 
        milkshake
    ).id(`createdelight:emptying/${outputFluidMilkshake.split(":")[1]}`)
}
    make_ice_cream(e, "#forge:bars/chocolate", "createdelightcore:chocolate_ice_cream", 
        "createdelight:chocolate_milkshake", 'alexscaves:chocolate_ice_cream_scoop', 
        "neapolitan:chocolate_ice_cream", "neapolitan:chocolate_milkshake", 'alexscaves:chocolate_ice_cream')
    make_ice_cream(e, "neapolitan:roasted_adzuki_beans", "createdelightcore:adzuki_ice_cream", 
        "createdelight:adzuki_milkshake", 'createdelightcore:adzuki_ice_cream_scoop', 
        "neapolitan:adzuki_ice_cream", "neapolitan:adzuki_milkshake", 'neapolitan:adzuki_ice_cream_block')
    make_ice_cream(e, "neapolitan:dried_vanilla_pods", "createdelightcore:vanilla_ice_cream", 
        "createdelight:vanilla_milkshake", 'alexscaves:vanilla_ice_cream_scoop', 
        "neapolitan:vanilla_ice_cream", "neapolitan:vanilla_milkshake", 'alexscaves:vanilla_ice_cream')
    make_ice_cream(e, "#forge:fruits/banana", "createdelightcore:banana_ice_cream", 
        "createdelight:banana_milkshake", 'createdelightcore:banana_ice_cream_scoop', 
        "neapolitan:banana_ice_cream", "neapolitan:banana_milkshake", 'neapolitan:banana_ice_cream_block')
    make_ice_cream(e, "neapolitan:strawberries", "createdelightcore:strawberry_ice_cream", 
        "createdelight:strawberry_milkshake", 'createdelightcore:strawberry_ice_cream_scoop', 
        "neapolitan:strawberry_ice_cream", "neapolitan:strawberry_milkshake", 'neapolitan:strawberry_ice_cream_block')
    make_ice_cream(e, "neapolitan:mint_leaves", "createdelightcore:mint_ice_cream", 
        "createdelight:mint_milkshake", 'createdelightcore:mint_ice_cream_scoop', 
        "neapolitan:mint_ice_cream", "neapolitan:mint_milkshake", 'neapolitan:mint_ice_cream_block')
    make_ice_cream(e, "#forge:fruits/lime", "createdelightcore:lime_ice_cream", 
        "createdelight:lime_milkshake", 'createdelightcore:lime_ice_cream_scoop', 
        "collectorsreap:lime_ice_cream", "collectorsreap:lime_milkshake", 'collectorsreap:lime_ice_cream_block')
    make_ice_cream(e, "#forge:fruits/pomegranate", "createdelightcore:pomegranate_ice_cream", 
        "createdelight:pomegranate_milkshake", 'createdelightcore:pomegranate_ice_cream_scoop', 
        "collectorsreap:pomegranate_ice_cream", "collectorsreap:pomegranate_milkshake", 'collectorsreap:pomegranate_ice_cream_block')
    make_ice_cream(e, '#alexscaves:sweet_berries', "createdelightcore:sweetberry_ice_cream", 
        "createdelight:sweetberry_milkshake", 'alexscaves:sweetberry_ice_cream_scoop', 
        "createdelightcore:sweetberry_ice_cream", "createdelightcore:sweetberry_milkshake", 'alexscaves:sweetberry_ice_cream')
    kubejs.shapeless(
        "3x createdelightcore:sweetberry_milkshake",
        [
            "3x minecraft:glass_bottle",
            "createdelightcore:sweetberry_ice_cream",
            Ingredient.of("#forge:milk")
        ]
    ).id("createdelight:shapeless/sweetberry_milkshake")
{
    let iner = 'createdelight:incomplete_neapolitan_ice_cream'
    create.sequenced_assembly("neapolitan:neapolitan_ice_cream", "minecraft:bowl",
        [
            create.deploying(iner, [iner, 'alexscaves:chocolate_ice_cream_scoop']),
            create.deploying(iner, [iner, 'alexscaves:vanilla_ice_cream_scoop']),
            create.deploying(iner, [iner, 'createdelightcore:strawberry_ice_cream_scoop'])
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/neapolitan_ice_cream")
}
})