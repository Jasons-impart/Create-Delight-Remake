ServerEvents.compostableRecipes(e => {
  let compostables = [
     ['createdelight:adzuki_beans_seed', 0.3],
     ['festival_delicacies:eggplant_seeds', 0.3],
     ['festival_delicacies:chinese_cabbage_seeds', 0.3],
     ['festival_delicacies:garlic_chive_seeds', 0.3],
     ['festival_delicacies:fennel_seeds', 0.3],
     ['createdelight:artemisia_argyi_seed', 0.3],
     ['festival_delicacies:chinese_cabbage', 0.65],
     ['festival_delicacies:garlic_chive', 0.65],
     ['festival_delicacies:fennel', 0.65],
     ['festival_delicacies:eggplant', 0.65],
     ['festival_delicacies:artemisia_argyi', 0.5],
     ['festival_delicacies:garlic', 0.5],
     ['festival_delicacies:greenonion', 0.5],
     ['festival_delicacies:chinese_cabbage_leaf', 0.5],
     ['festival_delicacies:jujube', 0.5],
     ['culturaldelights:corn_cob', 0.3],
     ['culturaldelights:eggplant', 0.3],
     ['createcafe:cassava_root', 0.3],
  ]
  compostables.forEach(compostable => {
      e.add(compostable[0], compostable[1]) 
  })
})