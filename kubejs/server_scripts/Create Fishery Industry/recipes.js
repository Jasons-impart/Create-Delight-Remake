ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    e.replaceInput({id: "createfisheryindustry:frame_trap"}, "minecraft:string", "#bookshelf:strings")
    e.replaceInput({id: "createfisheryindustry:harpoon_pouch"}, "minecraft:string", "#bookshelf:strings")
    e.replaceInput({id: "createfisheryindustry:smart_mesh"}, "#minecraft:wool", "createfisheryindustry:mesh_trap")
    e.replaceOutput({id: "createfisheryindustry:farmerdelight/cod_steak_cutting"}, "minecraft:bone_meal", "crabbersdelight:fish_bones")
    e.replaceOutput({id: "createfisheryindustry:farmerdelight/salmon_steak_cutting"}, "minecraft:bone_meal", "crabbersdelight:fish_bones")
    e.replaceOutput({id: "createfisheryindustry:farmerdelight/cod_steak_cutting_using_deployer"}, "minecraft:bone_meal", "crabbersdelight:fish_bones")
    e.replaceOutput({id: "createfisheryindustry:farmerdelight/salmon_steak_cutting_using_deployer"}, "minecraft:bone_meal", "crabbersdelight:fish_bones")
    remove_recipes_id(e, [
        "createfisheryindustry:pressing/zinc_ingot",
        "createfisheryindustry:pressing/zinc_plate",
        "/createfisheryindustry:.*cooked_lobster/",
        "createfisheryindustry:mechanical_crafting/pneumatic_harpoon_gun",
        "createfisheryindustry:sequenced_assembly/pneumatic_mechanism",
        "createfisheryindustry:mesh_trap"
    ])
    kubejs.shaped("createfisheryindustry:mesh_trap", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "vintageimprovements:zinc_rod",
        B: "farmersdelight:canvas",
        C: "#bookshelf:strings"
    }).id("createdelight:mesh_trap")
})