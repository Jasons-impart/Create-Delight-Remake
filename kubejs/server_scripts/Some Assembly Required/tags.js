ServerEvents.tags("item", e => {
    e.add("forge:vegetables/tomato", ["some_assembly_required:tomato_slices"])
    e.add("forge:vegetables/onion", ["some_assembly_required:sliced_onion"])
    e.add("forge:crops/tomato", ["some_assembly_required:tomato_slices"])
    e.add("forge:crops/onion", ["some_assembly_required:sliced_onion"])
    e.add("forge:fermentable", [
        "some_assembly_required:tomato_slices",
        "some_assembly_required:sliced_onion"
    ])
    e.add("festival_delicacies:onion", ["some_assembly_required:sliced_onion"])
})
