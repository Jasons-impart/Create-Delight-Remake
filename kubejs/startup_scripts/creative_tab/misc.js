const Inf_Fluid = [
  "minecraft:water",
  "minecraft:lava",
  "alexscaves:acid",
  "alexscaves:purple_soda",
  "ratatouille:cocoa_liquor",
  "createdelight:egg_yolk",
  "createcafe:melted_sugar",
  "create:honey",
  "createdelight:vinegar",
  "createmetallurgy:molten_iron",
  "createmetallurgy:molten_gold",
  "createmetallurgy:molten_copper",
  "createmetallurgy:molten_zinc",
  "createmetallurgy:molten_brass",
  "createmetallurgy:molten_tungsten",
  "createmetallurgy:molten_steel",
  "createmetallurgy:molten_netherite",
  "createmetallurgy:molten_aluminum",
  "createmetallurgy:molten_lead",
  "createmetallurgy:molten_nickel",
  "createmetallurgy:molten_osmium",
  "createmetallurgy:molten_silver",
  "createmetallurgy:molten_tin",
  "createmetallurgy:molten_invar",
  "createmetallurgy:molten_electrum",
  "createmetallurgy:molten_bronze",
  "createmetallurgy:molten_constantan",
  "createmetallurgy:molten_void_steel",
  "createdelight:molten_andesite",
  "createdelight:molten_desh",
  "createdelight:molten_ostrum",
  "createdelight:molten_calorite",
  "createdelight:molten_scarlet_neodymium",
  "createdelight:molten_azure_neodymium",
  "createdelight:molten_fire_steel",
  "createdelight:molten_ice_steel",
  "createdelight:molten_lightning_steel",
  "createdelight:molten_forged_steel",
];

// 机素防护
StartupEvents.modifyCreativeTab("protection_pixel:pp", e => {
  e.add([
    Item.of('createdelight:fire_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:ice_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:lightning_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}')
  ])
  e.remove([
    'protection_pixel:hookcannon',
    'protection_pixel:hookitem'
  ])
})
// tetra
StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    custom_scroll([1, 1, 4, 5], 1, "bow/stave/remembrance_stave", 1, ["tetra:bow/stave/remembrance_stave"], "c10000"),
  ])
})
StartupEvents.modifyCreativeTab("art_of_forging:art_of_forging", e => {
  e.add([
    'createdelight:demonic_codex',
    'createdelight:otherworld_note',
    'createdelight:dread_heart',
    'createdelight:devil_eye',
  ])
})
// epp
StartupEvents.modifyCreativeTab("expatternprovider:tab_main", e => {
  Inf_Fluid.forEach((f) => {
  e.add(Item.of("expatternprovider:infinity_cell", `{record:{"#c":"ae2:f",id:"${f}"}}`))
    });
  e.remove([
    "expatternprovider:assembler_matrix_frame",
    "expatternprovider:assembler_matrix_wall",
    "expatternprovider:assembler_matrix_pattern",
    "expatternprovider:assembler_matrix_crafter",
    "expatternprovider:assembler_matrix_speed",
    'expatternprovider:assembler_matrix_glass',
  ])
})

StartupEvents.modifyCreativeTab("alexsmobs:alexsmobs", e => {
  e.remove([
    "alexsmobs:banana"
  ])
})

StartupEvents.modifyCreativeTab("moreburners:moreburners_tab", e => {
  e.remove([
    "moreburners:nickel_coil"
  ])
})

StartupEvents.modifyCreativeTab("torchmaster:creative_tab", e => {
  e.remove([
    'torchmaster:feral_flare_lantern',
    'torchmaster:frozen_pearl'
  ])
})

StartupEvents.modifyCreativeTab("ae2:main", e => {
  e.add([
    'createdelight:universal_press',
    'createdelight:bleak_electron_tube'
  ])
})

StartupEvents.modifyCreativeTab("iceandfire:items", e => {
  e.add([
    'dreadsteel:dreadsteel_ingot',
    'dreadsteel:kit_default',
    'dreadsteel:kit_white',
    'dreadsteel:kit_black',
    'dreadsteel:kit_bronze',
  ])
})

StartupEvents.modifyCreativeTab("minecraft:ingredients", e => {
  e.remove([
    'dreadsteel:dreadsteel_ingot',
    'dreadsteel:kit_default',
    'dreadsteel:kit_white',
    'dreadsteel:kit_black',
    'dreadsteel:kit_bronze',
  ])
})

StartupEvents.modifyCreativeTab("kinetic_pixel:kineticpixel", e => {
  e.remove([
    'kinetic_pixel:firearmworktable',
    'kinetic_pixel:wildgraycotton',
    'kinetic_pixel:graycotton',
    'kinetic_pixel:graycottonseed',
    'kinetic_pixel:bambooshell',
    'kinetic_pixel:bambooshell',
    Item.of('kinetic_pixel:pressurepoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:heatpoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:laboratorialfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:magicpoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    'kinetic_pixel:gascylinder',
    'kinetic_pixel:emptygascylinder',
    'kinetic_pixel:brasscompressionsheet',
    'kinetic_pixel:andesitealloycompressionsheet',
    'kinetic_pixel:specialsteelcompressionsheet',
    'kinetic_pixel:enderalloycompressionsheet',
    'kinetic_pixel:enderalloyingot',
    'kinetic_pixel:specialsteelingot',
    'kinetic_pixel:componenttemplate',
    'kinetic_pixel:nitropropellant',
    'kinetic_pixel:wastedbarrel',
  ])
})