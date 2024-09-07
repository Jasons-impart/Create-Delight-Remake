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
    
    //粉碎方铅岩获取铁粒和钒粒
    e.recipes.create.crushing([
        Item.of('minecraft:iron_nugget').withChance(0.15),
        Item.of('vintageimprovements:vanadium_nugget').withChance(0.15)],
        'alexscaves:galena'
    ).id("alexscaves:crushing/galena")

    crushing_ore(e, 'alexscaves:galena_iron_ore', 'create:crushed_raw_iron', 3, 'alexscaves:galena')
    crushing_ore(e, 'alexscaves:guanostone_redstone_ore', 'minecraft:redstone', 12, 'alexscaves:guanostone')
    crushing_ore(e, 'alexscaves:coprolith_coal_ore', 'minecraft:coal', 2, 'alexscaves:coprolith')

    //硫磺晶芽注入酸液生长
    e.recipes.create.filling(
        'alexscaves:sulfur_bud_medium',
        ['alexscaves:sulfur_bud_small', 
        Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_bud_medium")
    e.recipes.create.filling(
        'alexscaves:sulfur_bud_large',
        ['alexscaves:sulfur_bud_medium',
        Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_bud_large")
    e.recipes.create.filling(
        'alexscaves:sulfur_cluster',
        ['alexscaves:sulfur_bud_large',
        Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_cluster")
    

    //酸液再生（？）
    e.recipes.create.mixing(
        Fluid.of('alexscaves:acid').withAmount(1000),
        ['2x alexscaves:acidic_radrock',
        'minecraft:mud',
        Fluid.water(1000)]
    ).heated()
    .id("alexscaves:mixing/acid")

    e.recipes.create.compacting(
        '4x alexscaves:acidic_radrock',
        ['4x alexscaves:radrock',
        Fluid.of('alexscaves:acid').withAmount(1000)]
    ).heated()
    .id("alexscaves:compacting/acidic_radrock")
})