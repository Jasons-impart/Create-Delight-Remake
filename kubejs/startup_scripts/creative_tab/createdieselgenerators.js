StartupEvents.modifyCreativeTab("createdieselgenerators:cdg_creative_tab", e => {
  e.remove([
    Item.of('createdieselgenerators:mold', '{Mold:"createdieselgenerators:bowl"}'),
    Item.of('createdieselgenerators:mold', '{Mold:"createdieselgenerators:lines"}'),
    Item.of('createdieselgenerators:mold', '{Mold:"createdieselgenerators:chain"}'),
    Item.of('createdieselgenerators:mold', '{Mold:"createdieselgenerators:bar"}'),
    'createdieselgenerators:burner',
    'createdieselgenerators:wire_cutters',
    'createdieselgenerators:hammer',
    'createdieselgenerators:chemical_turret',
    'createdieselgenerators:chemical_sprayer',
    'createdieselgenerators:chemical_sprayer_lighter',
  ])
})