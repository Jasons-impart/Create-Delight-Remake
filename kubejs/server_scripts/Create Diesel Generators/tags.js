ServerEvents.tags('fluid', event => {
    // 为混合燃料添加标签，以保证北极星模组能够将其识别为火箭燃料
    // REF: https://github.com/Astronauts-of-Create/Northstar-Redux/issues/104
    event.add('forge:biofuel', 'createdelight:fuel_mixtures')
    event.add('forge:biofuel', 'createdelight:flowing_fuel_mixtures')

})
