StartupEvents.modifyCreativeTab("festival_delicacies:festival_delicacies", e => {
  e.add([
      'createdelight:adzuki_beans_seed',
      "createdelight:artemisia_argyi_seed"
    ]
  )
  e.remove([
    Item.of('festival_delicacies:boiled_dumpling', '{BlockEntityTag:{Dumpling:[{Count:1b,id:"festival_delicacies:garlic_chive"},{Count:1b,id:"minecraft:egg"}]}}'),
    Item.of('festival_delicacies:steamed_dumpling', '{BlockEntityTag:{Dumpling:[{Count:1b,id:"festival_delicacies:chinese_cabbage_leaf"},{Count:1b,id:"minecraft:cooked_porkchop"}]}}'),
    Item.of('festival_delicacies:steamed_dumpling', '{BlockEntityTag:{Dumpling:[{Count:1b,id:"festival_delicacies:chinese_cabbage_leaf"},{Count:1b,id:"minecraft:cooked_porkchop"}]}}'),
    'festival_delicacies:wonton'
  ])
})