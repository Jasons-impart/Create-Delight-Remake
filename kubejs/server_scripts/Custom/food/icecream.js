ServerEvents.recipes(e => {
    const { create, kubejs } = e.recipes
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} ingredient 
     * @param {Internal.FluidStackJS_} outputFluidIcecream 
     * @param {Internal.FluidStackJS_} outputFluidMilkshake
     * @param {Internal.ItemStack_} icecreamscoop
     * @param {Internal.ItemStack_} icecream 
     * @param {Internal.ItemStack_} milkshake 
     * @param {Internal.ItemStack_} icecreamblock 
     */
    function make_ice_cream(e, ingredient, outputFluidIcecream, outputFluidMilkshake, icecreamscoop, icecream, milkshake, icecreamblock) {
        e.remove({output: icecream, type: "crafting_shapeless"})
        e.remove({output: Fluid.of(outputFluidIcecream), type: "create:mixing"})
        e.recipes.createdelight.big_centrifugation()
            .inputFluids(Fluid.of(outputFluidMilkshake, 500))
            .outputFluids(Fluid.of("minecraft:milk", 250))
            .outputFluids(Fluid.of(outputFluidIcecream, 250))
            .duration(100)
        .id(`createdelight:big_centrifugation/separation/${outputFluidMilkshake.split(":")[1]}`)
        create.mixing(
            Fluid.of(outputFluidIcecream, 750),
            [
                ingredient,
                Fluid.of("cosmopolitan:cream", 500),
                Fluid.of("createdelight:base_syrup", 250)
            ]
        ).heatRequirement("cooled").id(`createdelight:mixing/${outputFluidIcecream.split(":")[1]}`)
        create.mixing(
            icecreamscoop,
            Fluid.of(outputFluidIcecream, 750)
        ).heatRequirement("frozen").id(`createdelight:mixing/${icecreamscoop.split(":")[1]}`)
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
            Fluid.of(outputFluidMilkshake, 500),
            [
                Fluid.of(outputFluidIcecream, 250),
                Fluid.of("minecraft:milk", 250)
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
    make_ice_cream(e, "#forge:bars/chocolate", "cosmopolitan:chocolate_ice_cream",
        "create_central_kitchen:chocolate_milkshake", 'alexscaves:chocolate_ice_cream_scoop',
        "neapolitan:chocolate_ice_cream", "neapolitan:chocolate_milkshake", 'alexscaves:chocolate_ice_cream')
    make_ice_cream(e, "neapolitan:roasted_adzuki_beans", "cosmopolitan:adzuki_ice_cream",
        "create_central_kitchen:adzuki_milkshake", 'createdelightcore:adzuki_ice_cream_scoop',
        "neapolitan:adzuki_ice_cream", "neapolitan:adzuki_milkshake", 'neapolitan:adzuki_ice_cream_block')
    make_ice_cream(e, "neapolitan:dried_vanilla_pods", "cosmopolitan:vanilla_ice_cream",
        "create_central_kitchen:vanilla_milkshake", 'alexscaves:vanilla_ice_cream_scoop',
        "neapolitan:vanilla_ice_cream", "neapolitan:vanilla_milkshake", 'alexscaves:vanilla_ice_cream')
    make_ice_cream(e, "#forge:fruits/banana", "cosmopolitan:banana_ice_cream",
        "create_central_kitchen:banana_milkshake", 'createdelightcore:banana_ice_cream_scoop',
        "neapolitan:banana_ice_cream", "neapolitan:banana_milkshake", 'neapolitan:banana_ice_cream_block')
    make_ice_cream(e, "neapolitan:strawberries", "cosmopolitan:strawberry_ice_cream",
        "create_central_kitchen:strawberry_milkshake", 'createdelightcore:strawberry_ice_cream_scoop',
        "neapolitan:strawberry_ice_cream", "neapolitan:strawberry_milkshake", 'neapolitan:strawberry_ice_cream_block')
    make_ice_cream(e, "neapolitan:mint_leaves", "cosmopolitan:mint_ice_cream",
        "create_central_kitchen:mint_milkshake", 'createdelightcore:mint_ice_cream_scoop',
        "neapolitan:mint_ice_cream", "neapolitan:mint_milkshake", 'neapolitan:mint_ice_cream_block')
    make_ice_cream(e, "#forge:fruits/lime", "cosmopolitan:lime_ice_cream",
        "create_central_kitchen:lime_milkshake", 'createdelightcore:lime_ice_cream_scoop',
        "collectorsreap:lime_ice_cream", "collectorsreap:lime_milkshake", 'collectorsreap:lime_ice_cream_block')
    make_ice_cream(e, "#forge:fruits/pomegranate", "cosmopolitan:pomegranate_ice_cream",
        "create_central_kitchen:pomegranate_milkshake", 'createdelightcore:pomegranate_ice_cream_scoop',
        "collectorsreap:pomegranate_ice_cream", "collectorsreap:pomegranate_milkshake", 'collectorsreap:pomegranate_ice_cream_block')
    make_ice_cream(e, '#alexscaves:sweet_berries', "cosmopolitan:sweet_berry_ice_cream",
        "create_central_kitchen:sweet_berry_milkshake", 'alexscaves:sweetberry_ice_cream_scoop',
        "seasonals:sweet_berry_ice_cream", "seasonals:sweet_berry_milkshake", 'seasonals:sweet_berry_ice_cream_block')
    make_ice_cream(e, "#seasonals:pumpkin_puree", "cosmopolitan:pumpkin_ice_cream",
        "create_central_kitchen:pumpkin_milkshake", "createdelightcore:pumpkin_ice_cream_scoop",
        "seasonals:pumpkin_ice_cream", "seasonals:pumpkin_milkshake", "seasonals:pumpkin_ice_cream_block")



    make_ice_cream(e, "#forge:fruits/apple", "cosmopolitan:apple_ice_cream",
        "createdelightcore:apple_milkshake", "createdelightcore:apple_ice_cream_scoop",
        "cosmopolitan:apple_ice_cream", "cosmopolitan:apple_milkshake", "cosmopolitan:apple_ice_cream_block")
    make_ice_cream(e, "#forge:vegetables/carrot", "cosmopolitan:carrot_ice_cream",
        "createdelightcore:carrot_milkshake", "createdelightcore:carrot_ice_cream_scoop",
        "cosmopolitan:carrot_ice_cream", "cosmopolitan:carrot_milkshake", "cosmopolitan:carrot_ice_cream_block")
    make_ice_cream(e, "quark:ancient_fruit", "cosmopolitan:enchanted_fruit_ice_cream",
        "createdelightcore:enchanted_fruit_milkshake", "createdelightcore:enchanted_fruit_ice_cream_scoop",
        "cosmopolitan:enchanted_fruit_ice_cream", "cosmopolitan:enchanted_fruit_milkshake", "cosmopolitan:enchanted_fruit_ice_cream_block")
    make_ice_cream(e, "#forge:fruits/glow_berries", "cosmopolitan:glow_berry_ice_cream",
        "createdelightcore:glow_berry_milkshake", "createdelightcore:glow_berry_ice_cream_scoop",
        "cosmopolitan:glow_berry_ice_cream", "cosmopolitan:glow_berry_milkshake", "cosmopolitan:glow_berry_ice_cream_block")
    make_ice_cream(e, "seasonals:roasted_beetroot", "cosmopolitan:beetroot_ice_cream",
        "createdelightcore:beetroot_milkshake", "createdelightcore:beetroot_ice_cream_scoop",
        "seasonals:beetroot_ice_cream", "seasonals:beetroot_milkshake", "seasonals:beetroot_ice_cream_block")

})
ItemEvents.rightClicked("createdelight:incomplete_neapolitan_ice_cream", e => {
    e.player.sendData("kubejs_player_playsound", {soundEvent: "neapolitan:item.ice_cream.eat"})
})
