StartupEvents.modifyCreativeTab("kinetic_pixel:kineticpixel", e => {
  e.remove([
    'kinetic_pixel:firearmworktable',
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
