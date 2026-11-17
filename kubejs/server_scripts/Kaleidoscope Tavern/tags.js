ServerEvents.tags("item", e => {
  e.add("forge:fruits/grape", [
    'kaleidoscope_tavern:grape',
    'kaleidoscope_tavern:ice_grape',
    'kaleidoscope_tavern:gold_grape',
    'kaleidoscope_tavern:green_grape',
  ])
  e.remove("forge:fruits/grapes", [
    'kaleidoscope_tavern:grape',
  ])
})