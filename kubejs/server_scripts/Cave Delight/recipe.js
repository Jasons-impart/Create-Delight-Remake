ServerEvents.recipes(e => {
    remove_recipes_input(e, [
        "cavedelight:pinenut_pie",
        "cavedelight:tectonic_cheesecake"
    ])
    remove_recipes_output(e, [
        "cavedelight:fiddlehead_tea"
    ])
    cutting_2(e, "cavedelight:tectonic_cheesecake", [["cavedelight:slice_of_tectonic_cheesecake", 4]])
    cutting_2(e, "cavedelight:pinenut_pie", [["cavedelight:slice_of_pinenut_pie", 4]])
    // brewing(e, )
})