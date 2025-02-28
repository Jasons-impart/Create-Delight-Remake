ServerEvents.recipes(e => {
    //下界钢锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("minecraft:netherite_ingot", "createmetallurgy:steel_ingot")
        .outputItems("2x createbigcannons:nethersteel_ingot")
        .inputFE(1000)
    //赤钕合金锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("2x createmetallurgy:iron_dust", "2x alexscaves:raw_scarlet_neodymium")
        .outputItems("alexscaves:scarlet_neodymium_ingot")
        .inputFE(1000)
    //青钕合金锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("2x createmetallurgy:iron_dust", "2x alexscaves:raw_azure_neodymium")
        .outputItems("alexscaves:azure_neodymium_ingot")
        .inputFE(1000)
    //下界合金锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("3x createmetallurgy:gold_dust", "3x minecraft:netherite_scrap")
        .outputItems("minecraft:netherite_ingot")
        .inputFE(1000)
    //琥珀金锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("createmetallurgy:gold_dust", "createdelight:silver_dust")
        .outputItems("2x createaddition:electrum_ingot")
        .inputFE(1000)
    //青铜锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("3x createmetallurgy:copper_dust", "createdelight:tin_dust")
        .outputItems("2x createdelight:bronze_ingot")
        .inputFE(1000)
    //钢锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("3x createmetallurgy:iron_dust", "createmetallurgy:coke")
        .outputItems("3x createmetallurgy:steel_ingot")
        .inputFE(1000)
    //黄铜锭
    e.recipes.mbd2.alloy_electric_furnace()
        .inputItems("createmetallurgy:copper_dust", "createmetallurgy:zinc_dust")
        .outputItems("2x create:brass_ingot")
        .inputFE(1000)
})