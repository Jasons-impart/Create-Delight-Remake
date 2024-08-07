ServerEvents.recipes(e => {
    //移除物品：钢制机壳
    e.remove({ output: 'alloyed:steel_casing' })
    e.remove({ id: 'alloyed:mixing/steel_ingot' })
})
