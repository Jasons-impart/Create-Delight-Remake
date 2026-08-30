const LUNAR_STATION_DIMENSION = "northstar:earth_orbit"
const LUNAR_STATION_Y = 96
const LUNAR_STATION_DATA_PREFIX = "createdelight_lunar_station_"
const LUNAR_STATION_WAYPOINT_BLOCK = "northstar:rocket_waypoint"

function getLunarStationCoordinates(player) {
    let data = player.persistentData
    if (data.getBoolean(`${LUNAR_STATION_DATA_PREFIX}generated`)) {
        return {
            x: data.getInt(`${LUNAR_STATION_DATA_PREFIX}x`),
            y: data.getInt(`${LUNAR_STATION_DATA_PREFIX}y`),
            z: data.getInt(`${LUNAR_STATION_DATA_PREFIX}z`)
        }
    }

    let hash = Math.abs(player.uuid.hashCode())
    let offsetX = 32768 + (hash % 8192)
    let offsetZ = 32768 + (Math.floor(hash / 8192) % 8192)
    return {
        x: Math.floor(((hash % 2 == 0 ? 1 : -1) * offsetX) / 16) * 16,
        y: LUNAR_STATION_Y,
        z: Math.floor(((Math.floor(hash / 2) % 2 == 0 ? 1 : -1) * offsetZ) / 16) * 16
    }
}

function runInLunarStationDimension(server, command) {
    return server.runCommandSilent(`execute in ${LUNAR_STATION_DIMENSION} run ${command}`)
}

function getLunarStationWaypointCoordinates(pos) {
    return {
        x: pos.x,
        y: pos.y - 1,
        z: pos.z + 18
    }
}

function placeLunarStationWaypoint(server, pos) {
    let waypoint = getLunarStationWaypointCoordinates(pos)
    let result = runInLunarStationDimension(
        server,
        `setblock ${waypoint.x} ${waypoint.y} ${waypoint.z} ${LUNAR_STATION_WAYPOINT_BLOCK}`
    )
    return result
}

function buildAbandonedOrbitalStation(server, pos) {
    const { x, y, z } = pos
    const shell = "northstar:titanium_sheetmetal"
    const trim = "create:industrial_iron_block"
    const window = "create:framed_glass"

    runInLunarStationDimension(server, `fill ${x - 9} ${y - 2} ${z - 7} ${x + 9} ${y + 6} ${z + 7} ${shell} hollow`)
    runInLunarStationDimension(server, `fill ${x - 8} ${y - 1} ${z - 6} ${x + 8} ${y + 5} ${z + 6} air`)
    runInLunarStationDimension(server, `fill ${x - 8} ${y - 2} ${z - 6} ${x + 8} ${y - 2} ${z + 6} ${trim}`)
    runInLunarStationDimension(server, `fill ${x - 8} ${y + 6} ${z - 6} ${x + 8} ${y + 6} ${z + 6} ${trim}`)

    runInLunarStationDimension(server, `fill ${x - 9} ${y} ${z - 3} ${x - 9} ${y + 3} ${z + 3} ${window}`)
    runInLunarStationDimension(server, `fill ${x + 9} ${y} ${z - 3} ${x + 9} ${y + 3} ${z + 3} ${window}`)
    runInLunarStationDimension(server, `fill ${x - 4} ${y + 1} ${z - 7} ${x + 4} ${y + 3} ${z - 7} ${window}`)

    runInLunarStationDimension(server, `fill ${x - 1} ${y - 1} ${z + 7} ${x + 1} ${y + 2} ${z + 7} air`)
    runInLunarStationDimension(server, `fill ${x - 3} ${y - 2} ${z + 8} ${x + 3} ${y - 2} ${z + 20} ${trim}`)
    runInLunarStationDimension(server, `fill ${x - 2} ${y - 1} ${z + 8} ${x + 2} ${y - 1} ${z + 20} create:metal_girder`)
    runInLunarStationDimension(server, `fill ${x - 5} ${y - 1} ${z - 5} ${x - 5} ${y + 4} ${z - 5} create:metal_girder`)
    runInLunarStationDimension(server, `fill ${x + 5} ${y - 1} ${z - 5} ${x + 5} ${y + 4} ${z - 5} create:metal_girder`)
    runInLunarStationDimension(server, `setblock ${x - 5} ${y + 4} ${z - 5} minecraft:sea_lantern`)
    runInLunarStationDimension(server, `setblock ${x + 5} ${y + 4} ${z - 5} minecraft:sea_lantern`)
    runInLunarStationDimension(server, `setblock ${x} ${y + 5} ${z} minecraft:redstone_lamp[lit=true]`)

    runInLunarStationDimension(server, `fill ${x + 6} ${y + 3} ${z + 4} ${x + 9} ${y + 6} ${z + 7} air`)
    runInLunarStationDimension(server, `fill ${x + 7} ${y - 2} ${z + 5} ${x + 10} ${y} ${z + 8} minecraft:oxidized_cut_copper`)
    runInLunarStationDimension(server, `setblock ${x + 4} ${y - 1} ${z - 3} minecraft:chest[facing=west]`)
    runInLunarStationDimension(server, `data merge block ${x + 4} ${y - 1} ${z - 3} {LootTable:\"createdelight:chests/abandoned_orbital_station\",CustomName:'{\"text\":\"破损的遥测储存箱\",\"color\":\"dark_aqua\"}'}`)

    runInLunarStationDimension(server, `setblock ${x - 3} ${y - 1} ${z + 1} northstar:computer_rack[facing=east]`)
    runInLunarStationDimension(server, `setblock ${x - 3} ${y - 1} ${z - 1} northstar:astronomy_table`)
    runInLunarStationDimension(server, `setblock ${x + 3} ${y - 1} ${z + 1} northstar:oxygen_sealer`)
    runInLunarStationDimension(server, `setblock ${x + 3} ${y - 1} ${z - 1} create:display_board[facing=west]`)

    return runInLunarStationDimension(server, `setblock ${x} ${y - 1} ${z + 19} minecraft:sea_lantern`)
}

function addLunarStationWaypoint(atlas, pos) {
    let waypoint = getLunarStationWaypointCoordinates(pos)
    let root = atlas.getOrCreateTag()
    let atlasTag = root.getCompound("atlas")
    let destinations = atlasTag.getList("destinations", 10)

    let createLabel = () => {
        let label = new global.CDServerJavaClasses.$CompoundTag()
        label.putString("text", "破损空间站")
        label.putString("color", "dark_aqua")
        return label
    }

    for (let i = 0; i < destinations.size(); i++) {
        let entry = destinations.getCompound(i)
        if (entry.getString("Dimension") != LUNAR_STATION_DIMENSION)
            continue
        let entryPos = entry.getCompound("Position")
        if (entryPos.getInt("X") == waypoint.x && entryPos.getInt("Y") == waypoint.y && entryPos.getInt("Z") == waypoint.z) {
            entry.put("label", createLabel())
            atlasTag.put("destinations", destinations)
            root.put("atlas", atlasTag)
            return false
        }
    }

    let destination = new global.CDServerJavaClasses.$CompoundTag()
    let target = new global.CDServerJavaClasses.$CompoundTag()
    target.putInt("X", waypoint.x)
    target.putInt("Y", waypoint.y)
    target.putInt("Z", waypoint.z)
    destination.putString("Dimension", LUNAR_STATION_DIMENSION)
    destination.put("Position", target)
    destination.putString("Direction", "up")
    destination.put("label", createLabel())
    destinations.add(destination)
    atlasTag.put("destinations", destinations)
    root.put("atlas", atlasTag)
    return true
}

function useOrbitalTelemetryScanner(event) {
    const { player, level, server } = event
    if (level.clientSide)
        return
    if (`${level.dimension}` != LUNAR_STATION_DIMENSION) {
        player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.wrong_dimension"))
        return
    }
    if (player.cooldowns.isOnCooldown(event.item.item))
        return

    let atlas = null
    player.inventory.allItems.forEach(stack => {
        if (atlas == null && stack.id == "northstar:space_atlas")
            atlas = stack
    })
    if (atlas == null) {
        player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.need_atlas"))
        return
    }

    let pos = getLunarStationCoordinates(player)
    if (player.persistentData.getBoolean(`${LUNAR_STATION_DATA_PREFIX}generated`)) {
        placeLunarStationWaypoint(server, pos)
        addLunarStationWaypoint(atlas, pos)
        player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.rediscovered", pos.x, pos.y, pos.z))
        player.addItemCooldown(event.item.item, 40)
        player.swing()
        return
    }

    player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.scanning"))
    player.addItemCooldown(event.item.item, 200)
    player.swing()
    runInLunarStationDimension(server, `forceload add ${pos.x - 32} ${pos.z - 32} ${pos.x + 32} ${pos.z + 32}`)

    server.scheduleInTicks(20, () => {
        let result = buildAbandonedOrbitalStation(server, pos)
        if (result > 0) {
            placeLunarStationWaypoint(server, pos)
            player.persistentData.putBoolean(`${LUNAR_STATION_DATA_PREFIX}generated`, true)
            player.persistentData.putInt(`${LUNAR_STATION_DATA_PREFIX}x`, pos.x)
            player.persistentData.putInt(`${LUNAR_STATION_DATA_PREFIX}y`, pos.y)
            player.persistentData.putInt(`${LUNAR_STATION_DATA_PREFIX}z`, pos.z)
            addLunarStationWaypoint(atlas, pos)
            player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.found", pos.x, pos.y, pos.z))
        } else {
            player.setStatusMessage(Component.translate("message.createdelight.orbital_scanner.failed"))
        }
        runInLunarStationDimension(server, `forceload remove ${pos.x - 32} ${pos.z - 32} ${pos.x + 32} ${pos.z + 32}`)
    })
}

ItemEvents.rightClicked("createdelight:orbital_telemetry_scanner", event => {
    useOrbitalTelemetryScanner(event)
})

ServerEvents.recipes(event => {
    event.shaped("createdelight:orbital_telemetry_scanner", [
        " T ",
        "ACP",
        " B "
    ], {
        T: "minecraft:spyglass",
        A: "northstar:advanced_circuit",
        C: "create:precision_mechanism",
        P: "northstar:titanium_sheet",
        B: "create:brass_casing"
    }).id("createdelight:shaped/orbital_telemetry_scanner")
})
