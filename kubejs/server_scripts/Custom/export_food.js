// ItemEvents.rightClicked(e => {
//   const{player} = e
//   if(player.mainHandItem.id != "minecraft:stick") return
//   /**@type {Internal.ItemStack[]} */
//   let itemStacks = []
//   Ingredient.all.itemIds.forEach(id => {
//       itemStacks.push(Item.of(`${id}`))
//   })
//   itemStacks.forEach(itemStack => {
//     if(itemStack.item.getFoodProperties() == null) return
//     let prop = itemStack.item.getFoodProperties()
//     let { nutrition, saturationModifier, effects } = prop
//     console.log(`${itemStack.id},${nutrition},${Math.round(saturationModifier*nutrition * 10)/10}`)
//   })
// })