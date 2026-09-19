StartupEvents.modifyCreativeTab("tacz:other", e => {
  e.remove([
    "tacz:gun_smith_table"
  ]) 
})
StartupEvents.modifyCreativeTab("tacz:ammo", e => {
  e.add([
    'createdelight:incomplete_bullet'
  ])
})