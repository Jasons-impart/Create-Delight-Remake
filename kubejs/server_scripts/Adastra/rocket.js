ServerEvents.recipes(e => {
    //动力合成器添加：一级火箭
    e.recipes.create.mechanical_crafting('ad_astra:tier_1_rocket', [
        '  A  ',
        ' BBB ',
        ' B B ',
        ' B B ',
        ' BBB ',
        'CDDDC',
        'CEEEC'
    ], {
        A: 'ad_astra:rocket_nose_cone',
        B: '#forge:storage_blocks/steel',
        C: 'ad_astra:rocket_fin',
        D: 'ad_astra:steel_tank',
        E: 'ad_astra:steel_engine'
    })
    //动力合成器添加：二级火箭
    e.recipes.create.mechanical_crafting('ad_astra:tier_2_rocket', [
        '  A  ',
        ' BBB ',
        ' B B ',
        ' B B ',
        ' BBB ',
        'CDDDC',
        'CEEEC'
    ], {
        A: 'ad_astra:rocket_nose_cone',
        B: 'ad_astra:desh_block',
        C: 'ad_astra:rocket_fin',
        D: 'ad_astra:desh_tank',
        E: 'ad_astra:desh_engine'
    })
    //动力合成器添加：三级火箭
    e.recipes.create.mechanical_crafting('ad_astra:tier_3_rocket', [
        '  A  ',
        ' BBB ',
        ' B B ',
        ' B B ',
        ' BBB ',
        'CDDDC',
        'CEEEC'
    ], {
        A: 'ad_astra:rocket_nose_cone',
        B: 'ad_astra:ostrum_block',
        C: 'ad_astra:rocket_fin',
        D: 'ad_astra:ostrum_tank',
        E: 'ad_astra:ostrum_engine'
    })
    //动力合成器添加：四级火箭
    e.recipes.create.mechanical_crafting('ad_astra:tier_4_rocket', [
        '  A  ',
        ' BBB ',
        ' B B ',
        ' B B ',
        ' BBB ',
        'CDDDC',
        'CEEEC'
    ], {
        A: 'ad_astra:rocket_nose_cone',
        B: 'ad_astra:calorite_block',
        C: 'ad_astra:rocket_fin',
        D: 'ad_astra:calorite_tank',
        E: 'ad_astra:calorite_engine'
    })
})