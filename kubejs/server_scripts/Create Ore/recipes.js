ServerEvents.recipes(e => {
    e.recipes.create.mechanical_crafting(
        "createoreexcavation:extractor", [
            "ABCBA",
            "BDEDB",
            "FGHGB",
            "BIIIB",
            "ABBBA"
        ], {
            A: "createmetallurgy:steel_block",
            B: "ad_astra:steel_plate",
            C: "create:mechanical_pump",
            D: "create:electron_tube",
            E: "create:hose_pulley",
            F: "create:brass_casing", 
            G: "create_sa:hydraulic_engine",
            H: "create:mechanical_drill",
            I: "create:sturdy_sheet"
        }
    ).id("createoreexcavation:extractor")
    e.recipes.create.mechanical_crafting(
        "createoreexcavation:drilling_machine", [
            "ABCBA",
            "BDEDB",
            "FGHGJ",
            "BIIIB",
            "ABBBA"
        ], {
            A: "createmetallurgy:steel_block",
            B: "ad_astra:steel_plate",
            C: "create:mechanical_pump",
            D: "create:electron_tube",
            E: "create:spout",
            F: "create:brass_casing", 
            G: 'create_sa:steam_engine',
            H: "create:mechanical_drill",
            I: "create:sturdy_sheet",
            J: "create:brass_tunnel"
        }
    ).id("createoreexcavation:drilling_machine")
})