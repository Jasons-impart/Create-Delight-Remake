ServerEvents.recipes(e => {
    // sandwich_spouting(fluid, result)；amount 写在 FluidStack 上
    function sandwich_spouting(fluid, amount, result) {
        e.recipes.some_assembly_required.sandwich_spouting(Fluid.of(fluid, amount), result)
            .id(`some_assembly_required:sandwich_spouting/${result.replace(":", "/")}`)
    }

    // fruitsdelight 果酱 → 果冻，125mB
    let fruits = [
        "apple", "bayberry", "blueberry", "chorus", "cranberry", "durian", "fig",
        "glowberry", "hamimelon", "hawberry", "kiwi", "lemon", "lychee", "mango",
        "mangosteen", "melon", "orange", "peach", "pear", "persimmon", "pineapple", "sweetberry"
    ]
    fruits.forEach(fruit => {
        sandwich_spouting(`fruitsdelight:${fruit}_jam`, 125, `fruitsdelight:${fruit}_jelly`)
    })

    sandwich_spouting("createdelightcore:lush_confiture_jelly", 125, "createdelightcore:lush_confiture_jelly_bottle")
    sandwich_spouting("create_central_kitchen:tomato_sauce", 250, "create_bic_bit:ketchup_bottle")
    sandwich_spouting("create_bic_bit:mayonnaise", 250, "create_bic_bit:mayonnaise_bottle")
    sandwich_spouting("the_bumblezone:royal_jelly_fluid_still", 250, "the_bumblezone:royal_jelly_bottle")
})
