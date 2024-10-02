ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tetra:murasama_scroll"
    ])
    e.recipes.kubejs.shaped(
        Item.of("tetra:scroll_rolled", "{BlockEntityTag:{data:[{details:"otherworldly",glyphs:[I;6,7,13,15],intricate:0b,key:"sword / katana / murasama_blade",material:2,ribbon:"c52323",schematics:["tetra: sword / katana / murasama_blade"]}]}}"),
        [
            "AEA",
            "BDB",
            "ACA"
        ],
        {
            A: "create:polished_rose_quartz",
            B: "#tetra:swords",
            C: "vintageimprovements:redstone_module",
            D: "minecraft:writable_book",
            E: "minecraft:netherite_ingot"
        }
    ).id("tetra:murasama_scroll")

    e.replaceInput({ mod: "tetra" }, "minecraft:writable_book", "createdelight:otherworld_note")
})
