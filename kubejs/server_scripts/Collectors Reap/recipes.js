ServerEvents.recipes(e => {
    const {create} = e.recipes
    remove_recipes_output(e, [
        "collectorsreap:lime_cake",
        "collectorsreap:pomegranate_cake",
        "collectorsreap:lime_cookie"
    ])
    e.replaceInput({id: "collectorsreap:food/buttered_legs"}, "collectorsreap:chieftain_leg", "#forge:crab_leg")
    e.replaceInput({id: "collectorsreap:food/buttered_legs"}, "#forge:milk", "createdelight:butter")
    e.replaceInput({}, "collectorsreap:cooked_tiger_prawn", "#forge:shrimps")
    make_cake(e, "collectorsreap:lime", "collectorsreap:lime_cake")
    make_cake(e, "collectorsreap:pomegranate", "collectorsreap:pomegranate_cake")

    create.mixing(Fluid.of("createdelight:limeade", 250), ["2x #forge:fruits/lime", "minecraft:sugar"])
    .id("createdelight:mixing/limeade")
    create.emptying([Fluid.of("createdelight:limeade", 250), "minecraft:glass_bottle"], "collectorsreap:limeade")
    .id("createdelight:emptying/limeade")
    create.filling("collectorsreap:limeade", [Fluid.of("createdelight:limeade", 250), "minecraft:glass_bottle"])
    .id("collectorsreap:filling/limeade")

    create.mixing(Fluid.of("createdelight:berry_limeade", 250), ["2x #forge:fruits/lime", "3x #forge:berries", "minecraft:sugar"])
    .id("createdelight:mixing/berry_limeade")
    create.mixing(Fluid.of("createdelight:berry_limeade", 250), ["3x #forge:berries", Fluid.of("createdelight:limeade", 250)])
    .id("createdelight:mixing/berry_limeade_2")
    create.emptying([Fluid.of("createdelight:berry_limeade", 250), "minecraft:glass_bottle"], "collectorsreap:berry_limeade")
    .id("createdelight:emptying/berry_limeade")
    create.filling("collectorsreap:berry_limeade", [Fluid.of("createdelight:berry_limeade", 250), "minecraft:glass_bottle"])
    .id("collectorsreap:filling/berry_limeade")

    create.mixing(Fluid.of("createdelight:pink_limeade", 250), ["2x #forge:fruits/lime", "3x #forge:fruits/pomegranate", "minecraft:sugar"])
    .id("createdelight:mixing/pink_limeade")
    create.mixing(Fluid.of("createdelight:pink_limeade", 250), ["3x #forge:fruits/pomegranate", Fluid.of("createdelight:limeade", 250)])
    .id("createdelight:mixing/pink_limeade_2")
    create.emptying([Fluid.of("createdelight:pink_limeade", 250), "minecraft:glass_bottle"], "collectorsreap:pink_limeade")
    .id("createdelight:emptying/pink_limeade")
    create.filling("collectorsreap:pink_limeade", [Fluid.of("createdelight:pink_limeade", 250), "minecraft:glass_bottle"])
    .id("collectorsreap:filling/pink_limeade")

    create.mixing(Fluid.of("createdelight:mint_limeade", 250), ["2x #forge:fruits/lime", "2x #neapolitan:mint_leaves", "minecraft:sugar"])
    .id("createdelight:mixing/mint_limeade")
    create.mixing(Fluid.of("createdelight:mint_limeade", 250), ["2x #neapolitan:mint_leaves", Fluid.of("createdelight:limeade", 250)])
    .id("createdelight:mixing/mint_limeade_2")
    create.emptying([Fluid.of("createdelight:mint_limeade", 250), "minecraft:glass_bottle"], "collectorsreap:mint_limeade")
    .id("createdelight:emptying/mint_limeade")
    create.filling("collectorsreap:mint_limeade", [Fluid.of("createdelight:mint_limeade", 250), "minecraft:glass_bottle"])
    .id("collectorsreap:filling/mint_limeade")
})