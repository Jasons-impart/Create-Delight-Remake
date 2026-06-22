ServerEvents.tags("minecraft:item", e => {
  e.add("forge:fruits/strawberry", [
    'northstar:martian_strawberry',
    'neapolitan:white_strawberries'
  ])
  e.removeAllTagsFrom([
    'neapolitan:chocolate_bar'
  ])
})