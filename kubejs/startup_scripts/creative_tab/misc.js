// 机素防护
StartupEvents.modifyCreativeTab("protection_pixel:pp", e => {
  e.add([
    Item.of('createdelight:fire_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:ice_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:lightning_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}')
  ])
})
// tetra
StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    custom_scroll([1, 1, 4, 5], 1, "bow/stave/remembrance_stave", 1, ["tetra:bow/stave/remembrance_stave"], "c10000"),
  ])
})
// epp
StartupEvents.modifyCreativeTab("expatternprovider:tab_main", e => {
  e.add([
    Item.of("expatternprovider:infinity_cell", '{record:{"#c":"ae2:f",id:"minecraft:lava"}}'),
  ])
  e.remove([
    "expatternprovider:assembler_matrix_frame",
    "expatternprovider:assembler_matrix_wall",
    "expatternprovider:assembler_matrix_pattern",
    "expatternprovider:assembler_matrix_crafter",
    "expatternprovider:assembler_matrix_speed"
  ])
})

StartupEvents.modifyCreativeTab("alexsmobs:alexsmobs", e => {
  e.remove([
    "alexsmobs:banana"
  ])
})

StartupEvents.modifyCreativeTab("moreburners:moreburners_tab", e => {
  e.remove([
    "moreburners:nickel_coil"
  ])
})