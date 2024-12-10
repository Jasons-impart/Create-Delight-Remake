ServerEvents.tags("minecraft:item", e => {
    e.add("the_bumblezone:crystalline_flower/cannot_consume", [
        "#minecraft:logs",
        "#minecraft:leaves",
        "#forge:stone",
        "#minecraft:stairs",
        "#minecraft:slabs",
        "#forge:cobblestone",
        "#minecraft:dirt",
        "#forge:gravel",
        "#forge:sand",
        "minecraft:clay_ball",
        "minecraft:clay",
        "#forge:nuggets/iron",
        "#forge:nuggets/gold"
    ])
    e.add("the_bumblezone:crystalline_flower/xp_2_when_consumed", [
        "create:experience_nugget"
    ])
}) 