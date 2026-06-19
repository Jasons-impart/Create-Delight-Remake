ServerEvents.recipes(e => {
    const { create, kubejs } = e.recipes
    remove_recipes_id(e, [
        "alexscaves:vanilla_ice_cream",
        "alexscaves:chocolate_ice_cream",
        "alexscaves:sweetberry_ice_cream"
    ])
    kubejs.shaped(
        '4x createdelightcore:lucuma_ice_cream_bricks',
        [
            "AA",
            "AA"
        ], {
            A: "collectorsreap:lucuma_ice_cream_block"
        }
    ).id("createdelight:shaped/lucuma_ice_cream_bricks")
    kubejs.shaped(
        '4x createdelightcore:pink_dragon_fruit_ice_cream_bricks',
        [
            "AA",
            "AA"
        ], {
            A: "collectorsreap:pink_dragon_fruit_ice_cream_block"
        }
    ).id("createdelight:shaped/pink_dragon_fruit_ice_cream_bricks")
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} ingredient 
     * @param {Internal.FluidStackJS_} outputFluidIcecream 
     * @param {Internal.FluidStackJS_} outputFluidMilkshake
     * @param {Internal.ItemStack_} icecreamscoop
     * @param {Internal.ItemStack_} icecream 
     * @param {Internal.ItemStack_} milkshake 
     * @param {Internal.ItemStack_} icecreamcone
     * @param {Internal.ItemStack_} icecreamblock 
     */
    function make_ice_cream(e, ingredient, outputFluidIcecream, outputFluidMilkshake, icecreamscoop, icecream, milkshake, icecreamcone, icecreamblock) {
        e.remove({output: icecream, type: "crafting_shapeless"})
        e.remove({output: icecreamcone, type: "crafting_shapeless"})
        e.remove({output: Fluid.of(outputFluidIcecream), type: "create:emptying"})
        e.remove({output: Fluid.of(outputFluidIcecream), type: "create:mixing"})
        e.remove({output: milkshake, type: "crafting_shapeless"})
        e.remove({output: milkshake, type: "create:filling"})
        e.remove({output: icecream, type: "create:filling"})
        e.remove({output: icecreamcone, type: "create:filling"})
        e.remove({output: icecreamblock, type: "crafting_shaped"})
        e.recipes.kubejs.shaped(
            icecreamblock,
            [
                "AA",
                "AA"
            ], {
                A: icecreamscoop
            }
        ).id(`createdelight:shaped/${icecreamblock.split(":")[1]}`)
        e.recipes.kubejs.shapeless(
                `4x ${icecreamscoop}`,
            [
                icecreamblock
            ]
        ).id(`createdelight:shapeless/${icecreamblock.split(":")[1]}`)
        e.recipes.kubejs.shapeless(
            milkshake,
            [
                "minecraft:glass_bottle",
                icecream,
                "#forge:milk"
            ]
        ).id(`createdelight:shapeless/${milkshake.split(":")[1]}`).replaceIngredient(icecream, "minecraft:bowl")
        e.recipes.create.deploying(
            icecreamcone,
            [
                "cosmopolitan:wafer_cone",
                icecreamscoop
            ]
        ).id(`createdelight:deploying/${icecreamcone.split(":")[1]}`)
        e.recipes.kubejs.shapeless(
            icecreamcone,
            [
                "cosmopolitan:wafer_cone",
                icecreamscoop
            ]
        ).id(`createdelight:shapeless/${icecreamcone.split(":")[1]}_manual_only`)
        e.recipes.kubejs.shapeless(
            icecreamcone,
            [
                "cosmopolitan:wafer_cone",
                icecream
            ]
        ).id(`createdelight:shapeless/${icecreamcone.split(":")[1]}_from_icecream`).replaceIngredient(icecream, "minecraft:bowl")
        e.recipes.createdelight.big_centrifugation()
            .inputFluids(Fluid.of(outputFluidMilkshake, 250))
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
            [
                Fluid.of(outputFluidIcecream, 250),
                "minecraft:bowl"
            ],
            icecream
        ).heated().id(`createdelight:empty_mixing/${icecream.split(":")[1]}`)
        create.mixing(
            icecreamscoop,
            Fluid.of(outputFluidIcecream, 250)
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
            Fluid.of(outputFluidMilkshake, 250),
            [
                icecreamscoop,
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
        create.deploying(
            milkshake,
            [
                "farmersdelight:milk_bottle",
                icecreamscoop
            ]
        ).id(`createdelight:deploying/${milkshake.split(":")[1]}_form_milk`)
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
        "neapolitan:chocolate_ice_cream", "neapolitan:chocolate_milkshake",
        'cosmopolitan:chocolate_ice_cream_cone', 'neapolitan:chocolate_ice_cream_block')

    make_ice_cream(e, "neapolitan:roasted_adzuki_beans", "cosmopolitan:adzuki_ice_cream",
        "create_central_kitchen:adzuki_milkshake", 'createdelightcore:adzuki_ice_cream_scoop',
        "neapolitan:adzuki_ice_cream", "neapolitan:adzuki_milkshake",
        'cosmopolitan:adzuki_ice_cream_cone', 'neapolitan:adzuki_ice_cream_block')

    make_ice_cream(e, "neapolitan:dried_vanilla_pods", "cosmopolitan:vanilla_ice_cream",
        "create_central_kitchen:vanilla_milkshake", 'alexscaves:vanilla_ice_cream_scoop',
        "neapolitan:vanilla_ice_cream", "neapolitan:vanilla_milkshake",
        'cosmopolitan:vanilla_ice_cream_cone', 'neapolitan:vanilla_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/banana", "cosmopolitan:banana_ice_cream",
        "create_central_kitchen:banana_milkshake", 'createdelightcore:banana_ice_cream_scoop',
        "neapolitan:banana_ice_cream", "neapolitan:banana_milkshake",
        'cosmopolitan:banana_ice_cream_cone', 'neapolitan:banana_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/strawberry", "cosmopolitan:strawberry_ice_cream",
        "create_central_kitchen:strawberry_milkshake", 'createdelightcore:strawberry_ice_cream_scoop',
        "neapolitan:strawberry_ice_cream", "neapolitan:strawberry_milkshake",
        'cosmopolitan:strawberry_ice_cream_cone', 'neapolitan:strawberry_ice_cream_block')

    make_ice_cream(e, "neapolitan:mint_leaves", "cosmopolitan:mint_ice_cream",
        "create_central_kitchen:mint_milkshake", 'createdelightcore:mint_ice_cream_scoop',
        "neapolitan:mint_ice_cream", "neapolitan:mint_milkshake",
        'cosmopolitan:mint_ice_cream_cone', 'neapolitan:mint_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/lime", "cosmopolitan:lime_ice_cream",
        "create_central_kitchen:lime_milkshake", 'createdelightcore:lime_ice_cream_scoop',
        "collectorsreap:lime_ice_cream", "collectorsreap:lime_milkshake",
        'cosmopolitan:lime_ice_cream_cone', 'collectorsreap:lime_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/pomegranate", "cosmopolitan:pomegranate_ice_cream",
        "create_central_kitchen:pomegranate_milkshake", 'createdelightcore:pomegranate_ice_cream_scoop',
        "collectorsreap:pomegranate_ice_cream", "collectorsreap:pomegranate_milkshake",
        'cosmopolitan:pomegranate_ice_cream_cone', 'collectorsreap:pomegranate_ice_cream_block')

    make_ice_cream(e, "collectorsreap:pink_dragon_fruit", "createdelight:pink_dragon_fruit_ice_cream",
        "createdelightcore:pink_dragon_fruit_milkshake", "createdelightcore:pink_dragon_fruit_ice_cream_scoop",
        "collectorsreap:pink_dragon_fruit_ice_cream", "collectorsreap:pink_dragon_fruit_milkshake",
        'createdelightcore:pink_dragon_fruit_ice_cream_cone', 'collectorsreap:pink_dragon_fruit_ice_cream_block')

    make_ice_cream(e, "collectorsreap:lucuma", "createdelight:lucuma_ice_cream",
        "createdelightcore:lucuma_milkshake", "createdelightcore:lucuma_ice_cream_scoop",
        "collectorsreap:lucuma_ice_cream", "collectorsreap:lucuma_milkshake",
        'createdelightcore:lucuma_ice_cream_cone', 'collectorsreap:lucuma_ice_cream_block')

    make_ice_cream(e, '#alexscaves:sweet_berries', "cosmopolitan:sweet_berry_ice_cream",
        "create_central_kitchen:sweet_berry_milkshake", 'alexscaves:sweetberry_ice_cream_scoop',
        "seasonals:sweet_berry_ice_cream", "seasonals:sweet_berry_milkshake",
        'cosmopolitan:sweet_berry_ice_cream_cone', 'seasonals:sweet_berry_ice_cream_block')

    make_ice_cream(e, "#seasonals:pumpkin_puree", "cosmopolitan:pumpkin_ice_cream",
        "create_central_kitchen:pumpkin_milkshake", 'createdelightcore:pumpkin_ice_cream_scoop',
        "seasonals:pumpkin_ice_cream", "seasonals:pumpkin_milkshake",
        'cosmopolitan:pumpkin_ice_cream_cone', 'seasonals:pumpkin_ice_cream_block')

    make_ice_cream(e, "seasonals:roasted_beetroot", "cosmopolitan:beetroot_ice_cream",
        "createdelightcore:beetroot_milkshake", "createdelightcore:beetroot_ice_cream_scoop",
        "seasonals:beetroot_ice_cream", "seasonals:beetroot_milkshake",
        'cosmopolitan:beetroot_ice_cream_cone', 'seasonals:beetroot_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/apple", "cosmopolitan:apple_ice_cream",
        "createdelightcore:apple_milkshake", 'createdelightcore:apple_ice_cream_scoop',
        "cosmopolitan:apple_ice_cream", "cosmopolitan:apple_milkshake",
        'cosmopolitan:apple_ice_cream_cone', 'cosmopolitan:apple_ice_cream_block')

    make_ice_cream(e, "#forge:vegetables/carrot", "cosmopolitan:carrot_ice_cream",
        "createdelightcore:carrot_milkshake", 'createdelightcore:carrot_ice_cream_scoop',
        "cosmopolitan:carrot_ice_cream", "cosmopolitan:carrot_milkshake",
        'cosmopolitan:carrot_ice_cream_cone', 'cosmopolitan:carrot_ice_cream_block')

    make_ice_cream(e, "quark:ancient_fruit", "cosmopolitan:enchanted_fruit_ice_cream",
        "createdelightcore:enchanted_fruit_milkshake", "createdelightcore:enchanted_fruit_ice_cream_scoop",
        "cosmopolitan:enchanted_fruit_ice_cream", "cosmopolitan:enchanted_fruit_milkshake",
        'cosmopolitan:enchanted_fruit_ice_cream_cone', 'cosmopolitan:enchanted_fruit_ice_cream_block')

    make_ice_cream(e, "#forge:fruits/glow_berries", "cosmopolitan:glow_berry_ice_cream",
        "createdelightcore:glow_berry_milkshake", "createdelightcore:glow_berry_ice_cream_scoop",
        "cosmopolitan:glow_berry_ice_cream", "cosmopolitan:glow_berry_milkshake",
        'cosmopolitan:glow_berry_ice_cream_cone', 'cosmopolitan:glow_berry_ice_cream_block')
})