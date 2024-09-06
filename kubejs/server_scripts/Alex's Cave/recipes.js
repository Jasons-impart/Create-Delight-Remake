ServerEvents.recipes(e => {
    //硫磺，硫磺晶簇->硫粉
    e.recipes.create.crushing([
            '3x alexscaves:sulfur_dust',
            Item.of('alexscaves:sulfur_dust').withChance(0.5)
        ], 'alexscaves:sulfur_cluster'
    ).id("alexscaves:crushing/sulfur_dust")
    e.recipes.create.crushing([
            'alexscaves:sulfur_dust',
            Item.of('alexscaves:sulfur_dust').withChance(0.25)
        ], 'vintageimprovements:sulfur'
    ).id("alexscaves:crushing/sulfur_dust_2")
    
    //粉碎方铅岩获取铁粒
    e.recipes.create.crushing(
        Item.of('minecraft:iron_nugget').withChance(0.15),
        'alexscaves:galena'
    ).id("alexscaves:crushing/galena")

    crushing_ore(e, 'alexscaves:galena_iron_ore', 'create:crushed_raw_iron', 3, 'alexscaves:galena')
    crushing_ore(e, 'alexscaves:guanostone_redstone_ore', 'minecraft:redstone', 12, 'alexscaves:guanostone')
    crushing_ore(e, 'alexscaves:coprolith_coal_ore', 'minecraft:coal', 2, 'alexscaves:coprolith')
})