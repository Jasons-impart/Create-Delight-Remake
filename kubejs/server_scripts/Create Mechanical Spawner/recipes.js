ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    //修改动力刷怪笼配方
    e.replaceInput({ id: "create_mechanical_spawner:mechanical_spawner" }, "minecraft:emerald", "alexscaves:amber_monolith")
    e.replaceInput([{ id: "create_mechanical_spawner:mechanical_spawner" }, { id: "create_mechanical_spawner:loot_collector" }], "create:brass_ingot", "createdelightcore:bronze_ingot")
    e.replaceInput([{ id: "create_mechanical_spawner:mechanical_spawner" }, { id: "create_mechanical_spawner:loot_collector" }], "create:brass_sheet", "vintageimprovements:bronze_sheet")

    e.remove({mod: "create_mechanical_spawner", type: "create:mixing"})
    // vintageimprovements.vacuumizing('createdelight:inferior_genetic_seed', [
    //     Fluid.of("netherexp:ectoplasm", 200),
    //     Fluid.of("create:potion", 50, {Potion: "minecraft:healing"})
    // ])
    // .id("create_mechanical_spawner:vacuumizing/inferior_genetic_seed")
    let inferior_genetic_seed_input = []
    for (let index = 0; index < 8; index++) {
        inferior_genetic_seed_input.push("createaddition:biomass")
    }
    inferior_genetic_seed_input.push("ae2:singularity")
    vintageimprovements.vacuumizing('16x createdelight:inferior_genetic_seed', inferior_genetic_seed_input.concat(Fluid.of("netherexp:ectoplasm", 250)))
    .id("create_mechanical_spawner:vacuumizing/inferior_genetic_seed_2")
    
    create.emptying([
        Fluid.of("create_mechanical_spawner:spawn_fluid_random", 50),
        Item.of("createdelight:normal_genetic_seed").withChance(0.4)],
        'createdelight:inferior_genetic_seed')
    .id("create_mechanical_spawner:emptying/normal_genetic_seed")

    create.emptying([
        Fluid.of("create_mechanical_spawner:spawn_fluid_random", 100),
        Item.of("createdelight:refined_genetic_seed").withChance(0.4)],
        'createdelight:normal_genetic_seed')
    .id("create_mechanical_spawner:emptying/refined_genetic_seed")
    
    create.emptying([
        Fluid.of("create_mechanical_spawner:spawn_fluid_random", 200),
        Item.of("createdelight:pure_genetic_seed").withChance(0.4)],
        'createdelight:refined_genetic_seed')
    .id("create_mechanical_spawner:emptying/pure_genetic_seed")


    create.compacting(Fluid.of("create_mechanical_spawner:spawn_fluid_random", 50), "createdelight:inferior_genetic_seed")
    .id("create_mechanical_spawner:emptying/spawn_fluid_random_from_inferior_genetic_seed")
    create.compacting(Fluid.of("create_mechanical_spawner:spawn_fluid_random", 100), "createdelight:normal_genetic_seed")
    .id("create_mechanical_spawner:emptying/spawn_fluid_random_from_normal_genetic_seed")
    create.compacting(Fluid.of("create_mechanical_spawner:spawn_fluid_random", 200), "createdelight:refined_genetic_seed")
    .id("create_mechanical_spawner:emptying/spawn_fluid_random_from_refined_genetic_seed")
    create.compacting(Fluid.of("create_mechanical_spawner:spawn_fluid_random", 400), "createdelight:pure_genetic_seed")
    .id("create_mechanical_spawner:emptying/spawn_fluid_random_from_pure_genetic_seed")
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {Internal.Ingredient_[]} input 
     * @param {Internal.FluidStackJS_} output 
     * @param {number} baseAmount 
     * @param {number} tier 
     */
    function create_spawn_fluid(e, input, output, baseAmount, tier) {
        if (tier >= 5) {
            e.recipes.create.mixing(
                [Fluid.of(output, baseAmount), Item.of("createdelight:inferior_genetic_seed").withChance(0.5)],
                input.concat(Item.of("createdelight:inferior_genetic_seed"), Fluid.of("create_mechanical_spawner:spawn_fluid_random", baseAmount)))
            .id(`create_mechanical_spawner:${output.split(":")[1]}_from_inferior_genetic_seed`)
        }
        if (tier >= 4) {
            e.recipes.create.mixing(
                [Fluid.of(output, baseAmount * 1.5), Item.of("createdelight:normal_genetic_seed").withChance(0.65)],
                input.concat(Item.of("createdelight:normal_genetic_seed"), Fluid.of("create_mechanical_spawner:spawn_fluid_random", baseAmount * 1.5)))
            .id(`create_mechanical_spawner:${output.split(":")[1]}_from_normal_genetic_seed`)
        }
        if (tier >= 3) {
            e.recipes.create.mixing(
                [Fluid.of(output, baseAmount * 2), Item.of("createdelight:refined_genetic_seed").withChance(0.8)],
                input.concat(Item.of("createdelight:refined_genetic_seed"), Fluid.of("create_mechanical_spawner:spawn_fluid_random", baseAmount * 2)))
            .id(`create_mechanical_spawner:${output.split(":")[1]}_from_refined_genetic_seed`)
        }
        if (tier >= 2) {
            e.recipes.create.mixing(
                [Fluid.of(output, baseAmount * 2.5), Item.of("createdelight:pure_genetic_seed").withChance(0.95)],
                input.concat(Item.of("createdelight:pure_genetic_seed"), Fluid.of("create_mechanical_spawner:spawn_fluid_random", baseAmount * 2.5)))
            .id(`create_mechanical_spawner:${output.split(":")[1]}_from_pure_genetic_seed`)
        }
        if (tier >= 1) {
            e.recipes.create.mixing(
                [Fluid.of(output, baseAmount * 4), Item.of("createdelight:flawless_genetic_seed")],
                input.concat(Item.of("createdelight:flawless_genetic_seed"), Fluid.of("create_mechanical_spawner:spawn_fluid_random", baseAmount * 4)))
            .id(`create_mechanical_spawner:${output.split(":")[1]}_from_flawless_genetic_seed`)
        }
    }

    create_spawn_fluid(e, ["2x minecraft:rotten_flesh"], "create_mechanical_spawner:spawn_fluid_zombie", 100, 5)
    create_spawn_fluid(e, ["2x minecraft:bone"], "create_mechanical_spawner:spawn_fluid_skeleton", 100, 5)
    create_spawn_fluid(e, ["2x minecraft:blaze_powder"], "create_mechanical_spawner:spawn_fluid_blaze", 100, 3)
    create_spawn_fluid(e, ["2x minecraft:gunpowder"], "create_mechanical_spawner:spawn_fluid_creeper", 100, 4)
    create_spawn_fluid(e, ["minecraft:rotten_flesh", Fluid.water(250)], "create_mechanical_spawner:spawn_fluid_drowned", 100, 4)
    create_spawn_fluid(e, ["minecraft:ghast_tear"], "create_mechanical_spawner:spawn_fluid_ghast", 100, 3)
    create_spawn_fluid(e, ["ae2:ender_dust"], "create_mechanical_spawner:spawn_fluid_enderman", 100, 3)
    create_spawn_fluid(e, ["minecraft:magma_cream"], "create_mechanical_spawner:spawn_fluid_magma_cube", 100, 4)
    create_spawn_fluid(e, ["minecraft:slime_ball"], "create_mechanical_spawner:spawn_fluid_slime", 100, 4)
    create_spawn_fluid(e, ["minecraft:spider_eye", "2x minecraft:string"], "create_mechanical_spawner:spawn_fluid_spider", 100, 4)
    create_spawn_fluid(e, ["art_of_forging:shards_of_malice", "iceandfire:witherbone"], "create_mechanical_spawner:spawn_fluid_wither_skeleton", 100, 3)
    create_spawn_fluid(e, ["createdelightcore:emerald_coin", Fluid.of("butchercraft:blood_fluid", 500)], "create_mechanical_spawner:spawn_fluid_evoker", 200, 2)
    create_spawn_fluid(e, ["minecraft:gold_block", Fluid.of("butchercraft:blood_fluid", 500)], "create_mechanical_spawner:spawn_fluid_pigling", 100, 2)
    create_spawn_fluid(e, ["minecraft:glowstone_dust", "minecraft:redstone"], "create_mechanical_spawner:spawn_fluid_witch", 100, 2)
    create_spawn_fluid(e, ["the_bumblezone:honeycomb_brood_block"], "create_mechanical_spawner:spawn_fluid_bee", 100, 3)
})