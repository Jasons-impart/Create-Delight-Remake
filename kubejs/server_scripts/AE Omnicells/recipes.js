ServerEvents.recipes(e => {
  e.remove({id: "ae2omnicells:ender_ingot_from_blocks"})
  e.recipes.create_new_age.energising(
    "createutilities:void_steel_ingot",
    "ae2omnicells:charged_ender_ingot",
    3200
  ).id("createdelight:energising/charged_ender_ingot")
})