let $TableItemManager = Java.loadClass('dev.xkmc.youkaishomecoming.content.pot.table.item.TableItemManager')
let $YHTagGen = Java.loadClass("dev.xkmc.youkaishomecoming.init.data.YHTagGen")
StartupEvents.init(e => {
  $TableItemManager.SUSHI_SAUCE["addMapping(java.lang.String,net.minecraft.tags.TagKey)"]("mayonnaise_bottle", $YHTagGen.forgeItem("mayonnaise"))
  $TableItemManager.HOSOMAKI_SAUCE["addMapping(java.lang.String,net.minecraft.tags.TagKey)"]("mayonnaise_bottle", $YHTagGen.forgeItem("mayonnaise"))
  $TableItemManager.FUTOMAKI_SAUCE["addMapping(java.lang.String,net.minecraft.tags.TagKey)"]("mayonnaise_bottle", $YHTagGen.forgeItem("mayonnaise"))
  $TableItemManager.CAL_SAUCE["addMapping(java.lang.String,net.minecraft.tags.TagKey)"]("mayonnaise_bottle", $YHTagGen.forgeItem("mayonnaise"))
  $TableItemManager.CAL_TOP_SAUCE["addMapping(java.lang.String,net.minecraft.tags.TagKey)"]("mayonnaise_bottle", $YHTagGen.forgeItem("mayonnaise"))
})