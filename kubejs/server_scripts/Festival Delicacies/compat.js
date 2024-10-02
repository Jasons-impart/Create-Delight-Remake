ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "festival_delicacies:cutting/eggplant"
    ])
    cutting(e, "festival_delicacies:eggplant", [["culturaldelights:cut_eggplant", 4]])
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "culturaldelights:eggplant" }],
        result: [{ item: "culturaldelights:cut_eggplant", count: 2 }],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }).id("tetracelium:cutting/culturaldelights_eggplant")
    cutting(e, "festival_delicacies:chinese_cabbage", [
        ["festival_delicacies:chinese_cabbage_leaf", 2],
        ["festival_delicacies:chinese_cabbage_leaf", 1, 0.3]
    ])
})
