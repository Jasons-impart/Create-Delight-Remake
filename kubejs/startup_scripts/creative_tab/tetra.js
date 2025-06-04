StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    custom_scroll([1, 1, 4, 5], 1, "bow/stave/remembrance_stave", 1, ["tetra:bow/stave/remembrance_stave"], "c10000")])
  e.add([
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_hammer_right_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_handle_material":"basic_handle/forged_steel_ingot","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right",honing_progress:560,id:"66c9276b-c330-4922-ad3b-b8a96cd223be"}'),
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/dreadsteel_ingot","double/basic_hammer_right_material":"basic_hammer/dreadsteel_ingot","double/basic_handle_material":"basic_handle/forged_steel_ingot","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right",honing_progress:560,id:"f259453a-3eac-463f-9e96-f33ba635f64b"}')
  ])
})