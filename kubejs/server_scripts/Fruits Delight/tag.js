ServerEvents.tags("minecraft:item", e => {
  e.add("forge:gelatin", [
    'minecraft:slime_ball'
  ])
  e.add("forge:jams", [
    'createdelightcore:lush_confiture_jelly_bottle'
  ])
  e.add("diet:fruits", [
    'createdelightcore:lush_confiture_jelly_bottle'
  ])
  e.add("diet:sugars", [
    'createdelightcore:lush_confiture_jelly_bottle'
  ])
  e.add("create:upright_on_belt", [
    'createdelightcore:lush_confiture_jelly_bottle'
  ])
  e.removeAllTagsFrom([
    'vintagedelight:apple_sauce_bottle',
    'vintagedelight:sweet_berry_jam_bottle',
    'vintagedelight:glow_berry_jam_bottle',
    'vintagedelight:gearo_berry_mason_jar',
    'vintagedelight:gearo_berry_jam_bottle'
  ])
})