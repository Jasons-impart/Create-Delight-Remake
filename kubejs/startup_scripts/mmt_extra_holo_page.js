// priority: 1000

if (Platform.isClientEnvironment() && Platform.isLoaded("extraholopage") && Platform.isLoaded("more_mod_tetra")) {
    ClientEvents.init(event => {
        const ExtraHoloPageClasses = global.CDStartupJavaClasses.getExtraHoloPageClasses()
        const $ExtraHoloRegister = ExtraHoloPageClasses.$ExtraHoloRegister
        const $ExtraHoloBuilder = ExtraHoloPageClasses.$ExtraHoloBuilder
        const $IModularItem = ExtraHoloPageClasses.$IModularItem
        const $ResourceLocation = ExtraHoloPageClasses.$ResourceLocation
        const ForgeRegistries = global.CDStartupJavaClasses.ForgeRegistries

        $ExtraHoloBuilder.ListX = [0, 1, -1, 2, 2, -2, -2, 3, -3, 4, 4, -4, -4, 5, -5, 6, 6, -6, -6, 7, -7, 8, 8, -8, -8, 9, -9]
        $ExtraHoloBuilder.ListY = [-1, 0, 0, -1, 1, -1, 1, 0, 0, -1, 1, -1, 1, 0, 0, -1, 1, -1, 1, 0, 0, -1, 1, -1, 1, 0, 0]

        const texture = new $ResourceLocation("tetra", "textures/gui/mmt_extra_holo.png")
        const entries = [
            ["modular_mmt_amulet", 0, 0],
            ["modular_mmt_necklace", 42, 0],
            ["modular_mmt_shoes", 84, 0],
            ["modular_mmt_ring", 126, 0],
            ["modular_mmt_crown", 0, 42],
            ["modular_mmt_glove", 42, 42],
            ["modular_mmt_heart_protecting_mirror", 84, 42],
            ["modular_mmt_bracelet", 126, 42],
            ["modular_mmt_emblem", 0, 84],
            ["modular_mmt_totem_of_undying", 42, 84],
            ["modular_mmt_white_container", 84, 84],
            ["modular_mmt_white_scabbard", 126, 84],
            ["modular_mmt_white_quiver", 0, 126],
            ["modular_mmt_white_bag", 42, 126],
            ["modular_mmt_bow", 84, 126]
        ]

        entries.forEach(([itemId, textureX, textureY]) => {
            const item = ForgeRegistries.ITEMS.getValue(new $ResourceLocation("more_mod_tetra", itemId))

            if (item == null) {
                console.warn(`[CDR] ExtraHoloPage skipped missing MMT item: more_mod_tetra:${itemId}`)
                return
            }

            if (!(item instanceof $IModularItem)) {
                console.warn(`[CDR] ExtraHoloPage skipped non-modular MMT item: more_mod_tetra:${itemId}`)
                return
            }

            $ExtraHoloRegister.register(item).setTexture(
                texture,
                42,
                42,
                textureX,
                textureY
            )
        })
    })
}
