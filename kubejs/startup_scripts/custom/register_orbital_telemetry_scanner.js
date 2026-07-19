StartupEvents.registry("item", event => {
    event.create("createdelight:orbital_telemetry_scanner")
        .translationKey("item.createdelight.orbital_telemetry_scanner")
        .texture("northstar:item/telescope")
        .rarity("rare")
        .unstackable()
        .tooltip(Text.translate("tooltip.createdelight.orbital_telemetry_scanner.1"))
        .tooltip(Text.translate("tooltip.createdelight.orbital_telemetry_scanner.2"))
})
