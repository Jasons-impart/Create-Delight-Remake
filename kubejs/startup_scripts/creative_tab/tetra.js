StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/netherite","double/basic_hammer_right_material":"basic_hammer/netherite","double/basic_handle_material":"basic_handle/forged_beam","double/binding":"double/socket","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right","double/socket_material":"double_socket/socket_nether_star",id:"ed5b188b-6aa1-4344-851e-f00f53fdb81f"}'),
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/netherite","double/basic_hammer_right_material":"basic_hammer/netherite","double/basic_handle_material":"basic_handle/forged_beam","double/binding":"double/socket","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right","double/socket_material":"double_socket/pure_darkness",id:"a511a000-63da-42dd-a7a6-6d0cdf3c5bc6"}'),
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_hammer_right_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_handle_material":"basic_handle/forged_steel_ingot","double/binding":"double/socket","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right","double/socket_material":"double_socket/pure_darkness",id:"4259b5fa-1915-4e5f-b822-95e25771c3b4"}'),
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/end_dragon_ingot","double/basic_hammer_right_material":"basic_hammer/end_dragon_ingot","double/basic_handle_material":"basic_handle/forged_beam","double/binding":"double/socket","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right","double/socket_material":"double_socket/pure_darkness",id:"3a6bc724-5719-4b56-95dd-4b906dbe09d4"}')
  ])
  e.add([
    custom_scroll([1, 1, 4, 5], 1, "bow/stave/remembrance_stave", 1, ["tetra:bow/stave/remembrance_stave"], "c10000"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/storm_combat", 2, ["createdelight:mmt_curios/storm_combat"], "62d9ff"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/hive_guard", 2, ["createdelight:mmt_curios/hive_guard"], "f4bf45"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/path_emblems", 2, ["createdelight:mmt_curios/path_emblems"], "b78cff"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/lunar_arcane", 2, ["createdelight:mmt_curios/lunar_arcane"], "9aa8ff"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/mars_guard", 2, ["createdelight:mmt_curios/mars_guard"], "c85b48"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/magnetic_precision", 2, ["createdelight:mmt_curios/magnetic_precision"], "e64f9b"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/ancient_purification", 2, ["createdelight:mmt_curios/ancient_purification"], "78b35a"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/deep_relic", 2, ["createdelight:mmt_curios/deep_relic"], "315d83"),
    custom_scroll([3, 8, 1, 4], 0, "mmt_curios/astral_dominion", 2, ["createdelight:mmt_curios/astral_dominion"], "d08cff")
  ])
})
//添加tetra部件
StartupEvents.modifyCreativeTab("createdelight:tetra_modul", e => {
  e.add([
    'createdelight:pale_steel_needle',
  ])
})
