ServerEvents.tags("minecraft:item", e => {
    e.add("forge:ham", [
        "farmersdelight:ham",
        "netherexp:hogham"
    ])
    e.add("forge:cooked_ham", [
        "farmersdelight:smoked_ham",
        "netherexp:cooked_hogham"
    ])
    e.removeAllTagsFrom("netherexp:glowcheese")
})