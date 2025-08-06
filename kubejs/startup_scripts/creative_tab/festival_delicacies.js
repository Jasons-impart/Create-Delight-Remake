StartupEvents.modifyCreativeTab("festival_delicacies:festival_delicacies", e => {
  e.remove([
    'festival_delicacies:rice',
    'festival_delicacies:red_bean'
  ])
  e.add([
      'createdelight:adzuki_beans_seed',
      "createdelight:artemisia_argyi_seed"
    ]
  )
})