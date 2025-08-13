ServerEvents.tags("minecraft:item", e => {
    e.add("forge:cooked_fishes/squid", 
        'culturaldelights:cooked_squid'
    )
    e.add("miners_delight:bat_wing", 
        "alexscaves:vesper_wing"
    )
    e.removeAll("forge:squid")
    e.add("forge:squid",
        "culturaldelights:squid",
        "culturaldelights:glow_squid"
    )
})