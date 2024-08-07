ServerEvents.recipes(e => {
    // 添加燃油和凌冰燃油成为烈焰人燃烧室的燃料
    e.custom({
        "type": "createaddition:liquid_burning",
        "input": {
            "fluid": "ad_astra:fuel",
            "amount": 1000
        },
        "burnTime": 80000,
        "superheated": true
    })
    e.custom({
        "type": "createaddition:liquid_burning",
        "input": {
            "fluid": "ad_astra:cryo_fuel",
            "amount": 1000
        },
        "burnTime": 36000,
        "superheated": true
    })
    // 添加混合燃料为烈焰人燃烧室的燃料
    e.custom({
        "type": "createaddition:liquid_burning",
        "input": {
            "fluid": 'createdelight:fuel_mixtures',
            "amount": 1000
        },
        "burnTime": 72000,
        "superheated": true
    })
})
