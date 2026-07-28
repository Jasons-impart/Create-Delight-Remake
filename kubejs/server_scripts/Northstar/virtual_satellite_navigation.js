// KubeJS prototype for docs/plan/satellite-navigation-system-plan.md.
// The satellite is authoritative persistent data; the items are only interaction surfaces.

const SATELLITE_DATA_KEY = "createdelight_virtual_satellites"
const SATELLITE_CARD_DIMENSION_KEY = "SatelliteTargetDimension"
const SATELLITE_INITIAL_ENERGY = 32
const SATELLITE_RISK_SAMPLE_RADIUS = 2
const SATELLITE_SEARCH_RADIUS = 128
const SATELLITE_SEARCH_STEP = 16
const SATELLITE_WAYPOINT_BLOCK = "northstar:rocket_waypoint"

const SATELLITE_GROUPS = {
    earth: {
        name: "地球测绘卫星",
        deploymentDimensions: ["northstar:earth_orbit"],
        targetDimensions: ["minecraft:overworld"]
    },
    moon: {
        name: "月球测绘卫星",
        deploymentDimensions: ["northstar:moon", "createdelight:lunar_farside"],
        targetDimensions: ["northstar:moon", "createdelight:lunar_farside"]
    },
    mars: {
        name: "火星测绘卫星",
        deploymentDimensions: ["northstar:mars"],
        targetDimensions: ["northstar:mars"]
    },
    mercury: {
        name: "水星测绘卫星",
        deploymentDimensions: ["northstar:mercury"],
        targetDimensions: ["northstar:mercury"]
    },
    venus: {
        name: "金星测绘卫星",
        deploymentDimensions: ["northstar:venus"],
        targetDimensions: ["northstar:venus"]
    },
    europa: {
        name: "土卫二测绘卫星",
        deploymentDimensions: ["northstar:europa"],
        targetDimensions: ["northstar:europa"]
    }
}

const SATELLITE_DIMENSION_NAMES = {
    "minecraft:overworld": "主世界",
    "northstar:moon": "月球",
    "createdelight:lunar_farside": "月背异常区",
    "northstar:mars": "火星",
    "northstar:mercury": "水星",
    "northstar:venus": "金星",
    "northstar:europa": "土卫二"
}

const SATELLITE_HAZARDOUS_BLOCKS = {
    "minecraft:lava": true,
    "minecraft:magma_block": true,
    "minecraft:fire": true,
    "minecraft:soul_fire": true,
    "minecraft:powder_snow": true,
    "minecraft:cactus": true,
    "minecraft:sweet_berry_bush": true,
    "northstar:sulfuric_acid": true
}

function readSatelliteData(player) {
    let raw = player.persistentData.getString(SATELLITE_DATA_KEY)
    if (!raw)
        return { version: 1, satellites: {} }
    try {
        return normalizeSatelliteData(player, JSON.parse(raw))
    } catch (error) {
        try {
            // Rhino serializes non-finite numbers as NaN instead of JSON null. Repair records
            // written by the first prototype so deployed satellites are not lost.
            let repaired = normalizeSatelliteData(player, JSON.parse(`${raw}`.replace(/\bNaN\b/g, "null")))
            writeSatelliteData(player, repaired)
            console.warn(`[Create Delight] Repaired virtual satellite data for ${player.username}`)
            return repaired
        } catch (repairError) {
            console.error(`[Create Delight] Failed to parse virtual satellite data for ${player.username}: ${error}; repair failed: ${repairError}`)
        }
        return { version: 1, satellites: {} }
    }
}

function finiteSatelliteNumber(value, fallback) {
    let number = Number(value)
    return isFinite(number) ? number : fallback
}

function normalizeSatelliteData(player, data) {
    if (data == null || typeof data != "object")
        data = {}
    data.version = finiteSatelliteNumber(data.version, 1)
    if (data.satellites == null || typeof data.satellites != "object")
        data.satellites = {}

    Object.keys(data.satellites).forEach(groupId => {
        let satellite = data.satellites[groupId]
        if (satellite == null || typeof satellite != "object") {
            delete data.satellites[groupId]
            return
        }
        satellite.deploymentTime = finiteSatelliteNumber(satellite.deploymentTime, 0)
        satellite.energy = Math.max(0, finiteSatelliteNumber(satellite.energy, 0))
        satellite.tier = Math.max(1, finiteSatelliteNumber(satellite.tier, 1))
        if (!satellite.satelliteId || `${satellite.satelliteId}`.endsWith("-undefined"))
            satellite.satelliteId = `${groupId}-${player.uuid}-${satellite.deploymentTime}`
    })
    return data
}

function writeSatelliteData(player, data) {
    player.persistentData.putString(SATELLITE_DATA_KEY, JSON.stringify(data, (key, value) => {
        return typeof value == "number" && !isFinite(value) ? 0 : value
    }))
}

function dimensionName(dimension) {
    return SATELLITE_DIMENSION_NAMES[dimension] || dimension
}

function findDeploymentGroup(dimension) {
    let groupId = null
    Object.keys(SATELLITE_GROUPS).forEach(id => {
        if (SATELLITE_GROUPS[id].deploymentDimensions.indexOf(dimension) >= 0)
            groupId = id
    })
    return groupId
}

function findCoverageGroup(dimension) {
    let groupId = null
    Object.keys(SATELLITE_GROUPS).forEach(id => {
        if (SATELLITE_GROUPS[id].targetDimensions.indexOf(dimension) >= 0)
            groupId = id
    })
    return groupId
}

function getAvailableTargetDimensions(data) {
    let dimensions = []
    Object.keys(SATELLITE_GROUPS).forEach(groupId => {
        let satellite = data.satellites[groupId]
        if (!satellite || satellite.state != "active" || satellite.energy <= 0)
            return
        SATELLITE_GROUPS[groupId].targetDimensions.forEach(dimension => {
            if (dimensions.indexOf(dimension) < 0)
                dimensions.push(dimension)
        })
    })
    return dimensions
}

function findSpaceAtlas(player) {
    let atlas = null
    player.inventory.allItems.forEach(stack => {
        if (atlas == null && stack.id == "northstar:space_atlas")
            atlas = stack
    })
    return atlas
}

function readCardName(item) {
    try {
        return `${item.hoverName.string}`.trim()
    } catch (error) {
        return ""
    }
}

function parseNavigationRequest(item) {
    let value = readCardName(item)
    if (!value || value == "卫星导航数据卡")
        return null

    let named = value.split("|")
    if (named.length >= 3) {
        let x = Number(named[named.length - 2].trim())
        let z = Number(named[named.length - 1].trim())
        if (Number.isFinite(x) && Number.isFinite(z)) {
            return {
                label: named.slice(0, named.length - 2).join("|").trim() || "卫星着陆点",
                x: Math.floor(x),
                z: Math.floor(z)
            }
        }
    }

    let coordinates = value.split(/[，,\s]+/).filter(part => part.length > 0)
    if (coordinates.length == 2) {
        let x = Number(coordinates[0])
        let z = Number(coordinates[1])
        if (Number.isFinite(x) && Number.isFinite(z)) {
            return {
                label: `卫星着陆点 ${Math.floor(x)}, ${Math.floor(z)}`,
                x: Math.floor(x),
                z: Math.floor(z)
            }
        }
    }
    return null
}

function isSafeLandingColumn(level, x, z) {
    // ServerLevel height queries use an empty chunk result when the remote chunk has
    // never been generated. Explicitly obtain the chunk before reading its heightmap.
    level.getChunk(Math.floor(x / 16), Math.floor(z / 16))
    let surfaceY = level.getHeight(global.CDServerJavaClasses.$HeightmapTypes.MOTION_BLOCKING_NO_LEAVES, x, z) - 1
    if (surfaceY <= level.minBuildHeight || surfaceY >= level.maxBuildHeight - 2)
        return null

    let groundPos = new global.CDServerJavaClasses.$BlockPos(x, surfaceY, z)
    if (!level.worldBorder.isWithinBounds(x + 0.5, z + 0.5))
        return null

    let groundState = level.getBlockState(groundPos)
    let groundId = `${level.getBlock(groundPos).id}`
    if (groundState.isAir() || !groundState.getFluidState().isEmpty() || SATELLITE_HAZARDOUS_BLOCKS[groundId])
        return null
    return surfaceY
}

function evaluateLandingSite(level, centerX, centerZ) {
    let centerY = isSafeLandingColumn(level, centerX, centerZ)
    if (centerY == null)
        return null

    let minY = 2147483647
    let maxY = -2147483648
    let validColumns = 0
    let totalColumns = 0
    for (let offsetX = -SATELLITE_RISK_SAMPLE_RADIUS; offsetX <= SATELLITE_RISK_SAMPLE_RADIUS; offsetX++) {
        for (let offsetZ = -SATELLITE_RISK_SAMPLE_RADIUS; offsetZ <= SATELLITE_RISK_SAMPLE_RADIUS; offsetZ++) {
            totalColumns++
            let y = isSafeLandingColumn(level, centerX + offsetX, centerZ + offsetZ)
            if (y == null)
                continue
            validColumns++
            minY = Math.min(minY, y)
            maxY = Math.max(maxY, y)
        }
    }
    let heightDelta = validColumns > 0 ? maxY - minY : 0
    let safetyScore = Math.max(1, Math.round(validColumns / totalColumns * 60 + Math.max(0, 40 - heightDelta * 4)))
    return {
        x: centerX,
        y: centerY,
        z: centerZ,
        heightDelta: heightDelta,
        safetyScore: safetyScore
    }
}

function searchSafeLandingSite(level, requestedX, requestedZ) {
    let direct = evaluateLandingSite(level, requestedX, requestedZ)
    if (direct != null)
        return direct

    for (let radius = SATELLITE_SEARCH_STEP; radius <= SATELLITE_SEARCH_RADIUS; radius += SATELLITE_SEARCH_STEP) {
        for (let offset = -radius; offset <= radius; offset += SATELLITE_SEARCH_STEP) {
            let candidates = [
                [requestedX + offset, requestedZ - radius],
                [requestedX + offset, requestedZ + radius],
                [requestedX - radius, requestedZ + offset],
                [requestedX + radius, requestedZ + offset]
            ]
            for (let i = 0; i < candidates.length; i++) {
                let candidate = evaluateLandingSite(level, candidates[i][0], candidates[i][1])
                if (candidate != null)
                    return candidate
            }
        }
    }
    return null
}

function writeSatelliteWaypoint(atlas, dimension, landing, label) {
    let root = atlas.getOrCreateTag()
    let content = global.CDServerJavaClasses.$SpaceAtlasContent.fromTag(root)
    // Remove destinations produced by the first prototype, which pointed at the
    // ground block one block below the physical Northstar waypoint.
    let legacyDestination = new global.CDServerJavaClasses.$RocketDestination(
        new global.CDServerJavaClasses.$ResourceLocation(dimension),
        new global.CDServerJavaClasses.$BlockPos(landing.x, landing.y - 1, landing.z),
        global.CDServerJavaClasses.$Direction.UP
    )
    content.destinations.remove(legacyDestination)
    let destination = new global.CDServerJavaClasses.$RocketDestination(
        new global.CDServerJavaClasses.$ResourceLocation(dimension),
        new global.CDServerJavaClasses.$BlockPos(landing.x, landing.y, landing.z),
        global.CDServerJavaClasses.$Direction.UP
    )

    let exists = content.destinations.containsKey(destination)
    let maxWaypoints = global.CDServerJavaClasses.$NorthstarConfigs.server().spaceAtlasMaxWaypoints.get()
    if (!exists && content.destinations.size() >= maxWaypoints)
        return false

    content.destinations.put(destination, Component.literal(label))
    content.toTag(root)
    return true
}

function placeSatelliteWaypoint(level, landing) {
    let waypointPos = new global.CDServerJavaClasses.$BlockPos(landing.x, landing.y + 1, landing.z)
    let waypointBlock = global.CDServerJavaClasses.$ForgeRegistries.BLOCKS.getValue(
        new global.CDServerJavaClasses.$ResourceLocation(SATELLITE_WAYPOINT_BLOCK)
    )
    if (waypointBlock == null)
        return null

    let previousState = level.getBlockState(waypointPos)
    let previousId = `${level.getBlock(waypointPos).id}`
    let changed = previousId != SATELLITE_WAYPOINT_BLOCK
    if (changed)
        level.setBlockAndUpdate(waypointPos, waypointBlock.defaultBlockState())

    let placedId = `${level.getBlock(waypointPos).id}`
    if (placedId != SATELLITE_WAYPOINT_BLOCK)
        return null

    return {
        landing: {
            x: landing.x,
            y: landing.y + 1,
            z: landing.z,
            heightDelta: landing.heightDelta,
            safetyScore: landing.safetyScore
        },
        pos: waypointPos,
        previousState: previousState,
        changed: changed
    }
}

function deployVirtualSatellite(event) {
    const { player, level, item } = event
    if (level.clientSide)
        return

    let dimension = `${level.dimension}`
    let groupId = findDeploymentGroup(dimension)
    if (groupId == null) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.wrong_deployment_dimension"))
        return
    }

    let data = readSatelliteData(player)
    let group = SATELLITE_GROUPS[groupId]
    let deploymentTime = finiteSatelliteNumber(level.time, 0)
    data.satellites[groupId] = {
        satelliteId: `${groupId}-${player.uuid}-${deploymentTime}`,
        displayName: group.name,
        ownerType: "player",
        ownerId: `${player.uuid}`,
        coverageGroup: groupId,
        deploymentDimension: dimension,
        deploymentTime: deploymentTime,
        tier: 1,
        modules: ["navigation_relay"],
        energy: SATELLITE_INITIAL_ENERGY,
        state: "active"
    }
    writeSatelliteData(player, data)

    if (!player.isCreative())
        item.shrink(1)
    player.addItemCooldown(item.item, 40)
    player.playSound("minecraft:ui.toast.challenge_complete")
    player.setStatusMessage(Component.translate("message.createdelight.satellite.deployed", group.name, SATELLITE_INITIAL_ENERGY))
    player.swing()
}

function cycleSatelliteTarget(event, data) {
    let dimensions = getAvailableTargetDimensions(data)
    if (dimensions.length == 0) {
        event.player.setStatusMessage(Component.translate("message.createdelight.satellite.none_available"))
        return
    }

    let tag = event.item.getOrCreateTag()
    let current = tag.getString(SATELLITE_CARD_DIMENSION_KEY)
    let index = dimensions.indexOf(current)
    let next = dimensions[(index + 1) % dimensions.length]
    tag.putString(SATELLITE_CARD_DIMENSION_KEY, next)
    event.player.setStatusMessage(Component.translate("message.createdelight.satellite.target_selected", dimensionName(next)))
    event.player.addItemCooldown(event.item.item, 5)
    event.player.swing()
}

function useSatelliteNavigationCard(event) {
    const { player, server, level, item } = event
    if (level.clientSide)
        return
    if (player.cooldowns.isOnCooldown(item.item)) {
        return
    }

    let data = readSatelliteData(player)
    if (player.isCrouching()) {
        cycleSatelliteTarget(event, data)
        return
    }

    let dimensions = getAvailableTargetDimensions(data)
    if (dimensions.length == 0) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.none_available"))
        return
    }

    let tag = item.getOrCreateTag()
    let dimension = tag.getString(SATELLITE_CARD_DIMENSION_KEY)
    if (dimensions.indexOf(dimension) < 0) {
        dimension = dimensions[0]
        tag.putString(SATELLITE_CARD_DIMENSION_KEY, dimension)
        player.setStatusMessage(Component.translate("message.createdelight.satellite.target_selected", dimensionName(dimension)))
        return
    }

    let request = parseNavigationRequest(item)
    if (request == null) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.invalid_card_name"))
        return
    }

    let groupId = findCoverageGroup(dimension)
    let satellite = groupId == null ? null : data.satellites[groupId]
    if (satellite == null || satellite.state != "active" || satellite.energy <= 0) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.no_coverage"))
        return
    }

    let atlas = findSpaceAtlas(player)
    if (atlas == null) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.need_atlas"))
        return
    }

    let targetLevel = server.getLevel(dimension)
    if (targetLevel == null) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.dimension_unavailable", dimension))
        return
    }

    player.setStatusMessage(Component.translate("message.createdelight.satellite.scanning", dimensionName(dimension), request.x, request.z))
    let landing = searchSafeLandingSite(targetLevel, request.x, request.z)
    if (landing == null) {
        player.addItemCooldown(item.item, 40)
        player.setStatusMessage(Component.translate("message.createdelight.satellite.no_safe_landing"))
        return
    }

    let placedWaypoint = placeSatelliteWaypoint(targetLevel, landing)
    if (placedWaypoint == null) {
        player.setStatusMessage(Component.translate("message.createdelight.satellite.waypoint_placement_failed"))
        return
    }
    landing = placedWaypoint.landing

    if (!writeSatelliteWaypoint(atlas, dimension, landing, request.label)) {
        if (placedWaypoint.changed)
            targetLevel.setBlockAndUpdate(placedWaypoint.pos, placedWaypoint.previousState)
        player.setStatusMessage(Component.translate("northstar.gui.rocket_waypoint.max_waypoints"))
        return
    }

    satellite.energy--
    writeSatelliteData(player, data)
    player.addItemCooldown(item.item, 40)
    player.playSound("minecraft:entity.experience_orb.pickup")
    player.setStatusMessage(Component.translate(
        "message.createdelight.satellite.waypoint_written",
        request.x,
        request.z,
        landing.x,
        landing.y,
        landing.z,
        satellite.energy
    ))
    player.swing()
}

ItemEvents.rightClicked("createdelight:folded_mapping_satellite", event => {
    deployVirtualSatellite(event)
})

ItemEvents.rightClicked("createdelight:satellite_navigation_data_card", event => {
    try {
        useSatelliteNavigationCard(event)
    } catch (error) {
        console.error(`[Create Delight] Satellite navigation failed: ${error}`)
    }
})

ServerEvents.recipes(event => {
    event.shaped("createdelight:folded_mapping_satellite", [
        "PTP",
        "ACA",
        "PBP"
    ], {
        P: "northstar:titanium_sheet",
        T: "minecraft:spyglass",
        A: "northstar:advanced_circuit",
        C: "create:precision_mechanism",
        B: "create:brass_casing"
    }).id("createdelight:shaped/folded_mapping_satellite")

    event.shaped("createdelight:satellite_navigation_data_card", [
        " T ",
        "ACA",
        " P "
    ], {
        T: "minecraft:compass",
        A: "northstar:circuit",
        C: "create:precision_mechanism",
        P: "minecraft:paper"
    }).id("createdelight:shaped/satellite_navigation_data_card")
})
