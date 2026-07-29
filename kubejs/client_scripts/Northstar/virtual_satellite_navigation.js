// Read-only client mirror of the authoritative server satellite records.
NetworkEvents.dataReceived("createdelight_virtual_satellite_data", event => {
    let raw = event.data.raw
    if (raw == null && event.data.get != null)
        raw = event.data.get("raw").getAsString()

    let player = event.player == null ? Client.player : event.player
    if (player == null || raw == null)
        return

    try {
        let parsed = JSON.parse(`${raw}`)
        player.persistentData.putString("createdelight_virtual_satellites", JSON.stringify(parsed))
    } catch (error) {
        console.error(`[Create Delight] Failed to receive virtual satellite data: ${error}`)
    }
})
