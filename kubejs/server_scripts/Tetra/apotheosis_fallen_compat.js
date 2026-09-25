// priority: 1100

;(() => {
    const applyMmtStaffLootCategory = () => {
        const classes = global.CDServerJavaClasses
        const itemId = new classes.$ResourceLocation("more_mod_tetra", "modular_mmt_iron_staff")

        classes.$AdventureConfig.TYPE_OVERRIDES.put(itemId, classes.$StaffLootCategory.STAFF)
    }

    // Apply immediately on script load/reload, then re-apply after server startup in
    // case Apotheosis reloads its legacy config later in the loading sequence.
    applyMmtStaffLootCategory()
    ServerEvents.loaded(() => applyMmtStaffLootCategory())
})()
