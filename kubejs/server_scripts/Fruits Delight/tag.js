ServerEvents.tags("minecraft:item", e => {
  e.add("forge:gelatin", [
    'minecraft:slime_ball'
  ])
  e.removeAllTagsFrom([
    'vintagedelight:apple_sauce_bottle',
    'vintagedelight:sweet_berry_jam_bottle',
    'vintagedelight:glow_berry_jam_bottle',
    'vintagedelight:gearo_berry_mason_jar',
    'vintagedelight:gearo_berry_jam_bottle'
  ])
})