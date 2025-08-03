//糖果洞穴
StartupEvents.modifyCreativeTab("alexscaves:candy_cavity", e => {
  e.remove([
    'alexscaves:hot_chocolate_bottle'
  ])
})
StartupEvents.modifyCreativeTab("alexscaves:toxic_caves", e => {
  e.remove([
   "alexscaves:nuclear_furnace_component", 
  ])
})