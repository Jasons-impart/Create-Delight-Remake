ServerEvents.tags("item", e => {
  e.add("forge:storage_blocks", "createutilities:void_steel_block")
  e.add("forge:storage_blocks/void_steel", "createutilities:void_steel_block")
})
ServerEvents.tags("block", e => {
  e.add("forge:storage_blocks", "createutilities:void_steel_block")
  e.add("forge:storage_blocks/void_steel", "createutilities:void_steel_block")
  e.add('minecraft:needs_diamond_tool', 'createutilities:void_steel_block')
})
