// KubeJS prototype for docs/plan/satellite-navigation-system-plan.md.
// The satellite is authoritative persistent data; the items are only interaction surfaces.

const SATELLITE_DATA_KEY = "createdelight_virtual_satellites"
const SATELLITE_CARD_DIMENSION_KEY = "SatelliteTargetDimension"
const SATELLITE_INITIAL_ENERGY = 32
const SATELLITE_RISK_SAMPLE_RADIUS = 2
const SATELLITE_WAYPOINT_BLOCK = "northstar:rocket_waypoint"
const SATELLITE_LANDING_PLATFORM_BLOCK = "northstar:titanium_plating"
const SATELLITE_LANDING_PLATFORM_RADIUS = 2
const SATELLITE_UI_NAME = "satellite_navigation_data_card"
const SATELLITE_UI_FILE = "ldlib:satellite_navigation_data_card"
const SATELLITE_CARD_X_KEY = "SatelliteRequestX"
const SATELLITE_CARD_Z_KEY = "SatelliteRequestZ"
const SATELLITE_CARD_LABEL_KEY = "SatelliteWaypointLabel"
const SATELLITE_COORDINATE_LIMIT = 29999984
const SATELLITE_DATA_SYNC_PACKET = "createdelight_virtual_satellite_data"
let SATELLITE_NAVIGATION_UI_CREATOR = null
try {
    SATELLITE_NAVIGATION_UI_CREATOR = UIProject.loadUIFromFile(SATELLITE_UI_FILE)
} catch (error) {
    console.error(`[Create Delight] Failed to load satellite navigation UI: ${error}`)
}

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

function syncSatelliteDataToClient(player) {
    if (player == null)
        return
    player.sendData(SATELLITE_DATA_SYNC_PACKET, {
        raw: JSON.stringify(readSatelliteData(player))
    })
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

function parseSatelliteCoordinate(value) {
    let text = `${value}`.trim()
    if (!/^-?\d+$/.test(text))
        return null
    let coordinate = Number(text)
    if (!Number.isFinite(coordinate) || Math.abs(coordinate) > SATELLITE_COORDINATE_LIMIT)
        return null
    return Math.floor(coordinate)
}

function dimensionFromName(name) {
    let dimension = null
    Object.keys(SATELLITE_DIMENSION_NAMES).forEach(id => {
        if (SATELLITE_DIMENSION_NAMES[id] == name)
            dimension = id
    })
    return dimension
}

function satelliteLandingSummary(dimension, request, landing) {
    let platformHint = landing.waterLanding ? "（水面，将部署着陆平台）" : ""
    return `${dimensionName(dimension)}：${request.x}, ${request.z} → ${landing.x}, ${landing.y + 1}, ${landing.z}${platformHint}`
}

function isSatelliteWater(fluidState) {
    if (fluidState.isEmpty())
        return false
    let fluidId = global.CDServerJavaClasses.$ForgeRegistries.FLUIDS.getKey(fluidState.getType())
    return fluidId != null && (`${fluidId}` == "minecraft:water" || `${fluidId}` == "minecraft:flowing_water")
}

function isSafeLandingColumn(level, x, z) {
    // The scan entry point generates only the requested chunk. Risk samples crossing
    // its edge must not synchronously generate more chunks on the server thread.
    if (!level.hasChunk(Math.floor(x / 16), Math.floor(z / 16)))
        return null
    let surfaceY = level.getHeight(global.CDServerJavaClasses.$HeightmapTypes.MOTION_BLOCKING_NO_LEAVES, x, z) - 1
    if (surfaceY <= level.minBuildHeight || surfaceY >= level.maxBuildHeight - 2)
        return null

    let groundPos = new global.CDServerJavaClasses.$BlockPos(x, surfaceY, z)
    if (!level.worldBorder.isWithinBounds(x + 0.5, z + 0.5))
        return null

    let groundState = level.getBlockState(groundPos)
    let groundId = `${level.getBlock(groundPos).id}`
    let fluidState = groundState.getFluidState()
    if (groundState.isAir() || SATELLITE_HAZARDOUS_BLOCKS[groundId])
        return null
    if (!fluidState.isEmpty() && !isSatelliteWater(fluidState))
        return null
    return surfaceY
}

function evaluateLandingSite(level, centerX, centerZ) {
    let centerY = isSafeLandingColumn(level, centerX, centerZ)
    if (centerY == null)
        return null

    let centerPos = new global.CDServerJavaClasses.$BlockPos(centerX, centerY, centerZ)
    let waterLanding = isSatelliteWater(level.getBlockState(centerPos).getFluidState())
    if (waterLanding) {
        let localX = ((centerX % 16) + 16) % 16
        let localZ = ((centerZ % 16) + 16) % 16
        if (localX < SATELLITE_LANDING_PLATFORM_RADIUS || localX > 15 - SATELLITE_LANDING_PLATFORM_RADIUS ||
            localZ < SATELLITE_LANDING_PLATFORM_RADIUS || localZ > 15 - SATELLITE_LANDING_PLATFORM_RADIUS)
            return null
    }

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
        safetyScore: safetyScore,
        waterLanding: waterLanding
    }
}

function searchSafeLandingSite(level, requestedX, requestedZ) {
    let requestedChunkX = Math.floor(requestedX / 16)
    let requestedChunkZ = Math.floor(requestedZ / 16)
    // Remote world generation is expensive in this modpack. Generate at most the one
    // chunk explicitly requested by the player, then search a few columns inside it.
    level.getChunk(requestedChunkX, requestedChunkZ)

    let direct = evaluateLandingSite(level, requestedX, requestedZ)
    if (direct != null)
        return direct

    let chunkMinX = requestedChunkX * 16
    let chunkMinZ = requestedChunkZ * 16
    let candidates = []
    let localSamples = [2, 7, 12]
    localSamples.forEach(localX => {
        localSamples.forEach(localZ => {
            let x = chunkMinX + localX
            let z = chunkMinZ + localZ
            candidates.push({
                x: x,
                z: z,
                distance: Math.abs(x - requestedX) + Math.abs(z - requestedZ)
            })
        })
    })
    candidates.sort((a, b) => a.distance - b.distance)
    for (let i = 0; i < candidates.length; i++) {
        let candidate = evaluateLandingSite(level, candidates[i].x, candidates[i].z)
        if (candidate != null)
            return candidate
    }
    return null
}

function ensureSatelliteLandingChunk(level, landing) {
    let chunkX = Math.floor(landing.x / 16)
    let chunkZ = Math.floor(landing.z / 16)
    if (!level.hasChunk(chunkX, chunkZ)) {
        try {
            level.getChunk(chunkX, chunkZ)
        } catch (error) {
            return false
        }
    }
    return true
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

function rollbackSatelliteBlocks(level, changes) {
    if (changes == null)
        return
    for (let i = changes.length - 1; i >= 0; i--)
        level.setBlockAndUpdate(changes[i].pos, changes[i].state)
}

function placeSatelliteLandingPlatform(level, landing) {
    if (!landing.waterLanding)
        return { changes: [] }

    let platformBlock = global.CDServerJavaClasses.$ForgeRegistries.BLOCKS.getValue(
        new global.CDServerJavaClasses.$ResourceLocation(SATELLITE_LANDING_PLATFORM_BLOCK)
    )
    if (platformBlock == null)
        return null

    let platformState = platformBlock.defaultBlockState()
    let changes = []
    for (let offsetX = -SATELLITE_LANDING_PLATFORM_RADIUS; offsetX <= SATELLITE_LANDING_PLATFORM_RADIUS; offsetX++) {
        for (let offsetZ = -SATELLITE_LANDING_PLATFORM_RADIUS; offsetZ <= SATELLITE_LANDING_PLATFORM_RADIUS; offsetZ++) {
            let pos = new global.CDServerJavaClasses.$BlockPos(
                landing.x + offsetX,
                landing.y,
                landing.z + offsetZ
            )
            if (!level.hasChunk(Math.floor(pos.x / 16), Math.floor(pos.z / 16)) ||
                !level.worldBorder.isWithinBounds(pos.x + 0.5, pos.z + 0.5)) {
                rollbackSatelliteBlocks(level, changes)
                return null
            }

            let previousState = level.getBlockState(pos)
            let fluidState = previousState.getFluidState()
            if (!previousState.isAir() && fluidState.isEmpty())
                continue
            if (!fluidState.isEmpty() && !isSatelliteWater(fluidState)) {
                rollbackSatelliteBlocks(level, changes)
                return null
            }
            if (previousState == platformState)
                continue

            if (!level.setBlockAndUpdate(pos, platformState)) {
                rollbackSatelliteBlocks(level, changes)
                return null
            }
            changes.push({ pos: pos, state: previousState })
        }
    }
    return { changes: changes }
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
            safetyScore: landing.safetyScore,
            waterLanding: landing.waterLanding
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
    syncSatelliteDataToClient(player)

    if (!player.isCreative())
        item.shrink(1)
    player.addItemCooldown(item.item, 40)
    player.playSound("minecraft:ui.toast.challenge_complete")
    player.setStatusMessage(Component.translate("message.createdelight.satellite.deployed", group.name, SATELLITE_INITIAL_ENERGY))
    player.swing()
}

function scanSatelliteNavigation(player, dimension, request) {
    if (findSpaceAtlas(player) == null)
        return { ok: false, message: "背包中需要携带一份星图，才能开始卫星扫描。" }

    let server = player.server
    let data = readSatelliteData(player)
    let dimensions = getAvailableTargetDimensions(data)
    if (dimensions.indexOf(dimension) < 0)
        return { ok: false, message: "该天体没有可用卫星，或导航能源已经耗尽。" }

    let targetLevel = server.getLevel(dimension)
    if (targetLevel == null)
        return { ok: false, message: `目标维度当前不可用：${dimension}` }

    let landing = searchSafeLandingSite(targetLevel, request.x, request.z)
    if (landing == null)
        return { ok: false, message: "目标区块内没有找到可用地表。" }

    return {
        ok: true,
        pending: {
            dimension: dimension,
            request: request,
            landing: landing
        }
    }
}

function confirmSatelliteNavigation(player, item, pending) {
    let data = readSatelliteData(player)
    let groupId = findCoverageGroup(pending.dimension)
    let satellite = groupId == null ? null : data.satellites[groupId]
    if (satellite == null || satellite.state != "active" || satellite.energy <= 0)
        return { ok: false, message: "卫星已离线，或导航能源已经耗尽。" }

    let atlas = findSpaceAtlas(player)
    if (atlas == null)
        return { ok: false, message: "背包中需要携带一份星图。" }

    let targetLevel = player.server.getLevel(pending.dimension)
    if (targetLevel == null)
        return { ok: false, message: `目标维度当前不可用：${pending.dimension}` }

    if (!ensureSatelliteLandingChunk(targetLevel, pending.landing))
        return { ok: false, message: "目标区块当前不可用，请重新扫描。" }
    let recheckedLanding = evaluateLandingSite(targetLevel, pending.landing.x, pending.landing.z)
    if (recheckedLanding == null || recheckedLanding.y != pending.landing.y)
        return { ok: false, message: "目标地表在扫描后发生变化，请重新扫描。" }

    let placedPlatform = null
    let placedWaypoint = null
    let landing = null
    try {
        placedPlatform = placeSatelliteLandingPlatform(targetLevel, recheckedLanding)
        if (placedPlatform == null)
            return { ok: false, message: "已找到水面着陆点，但无法在那里部署着陆平台。" }

        placedWaypoint = placeSatelliteWaypoint(targetLevel, recheckedLanding)
        if (placedWaypoint == null) {
            rollbackSatelliteBlocks(targetLevel, placedPlatform.changes)
            return { ok: false, message: "已找到着陆点，但无法在那里部署火箭航点。" }
        }
        landing = placedWaypoint.landing

        if (!writeSatelliteWaypoint(atlas, pending.dimension, landing, pending.request.label)) {
            if (placedWaypoint.changed)
                targetLevel.setBlockAndUpdate(placedWaypoint.pos, placedWaypoint.previousState)
            rollbackSatelliteBlocks(targetLevel, placedPlatform.changes)
            return { ok: false, message: "星图中的航点数量已经达到上限。" }
        }
    } catch (error) {
        if (placedWaypoint != null && placedWaypoint.changed)
            targetLevel.setBlockAndUpdate(placedWaypoint.pos, placedWaypoint.previousState)
        if (placedPlatform != null)
            rollbackSatelliteBlocks(targetLevel, placedPlatform.changes)
        console.error(`[Create Delight] Failed to commit satellite waypoint: ${error}`)
        return { ok: false, message: "写入星图时发生异常，未保留新建的火箭航点。" }
    }

    satellite.energy--
    writeSatelliteData(player, data)
    syncSatelliteDataToClient(player)
    player.addItemCooldown(item.item, 40)
    player.playSound("minecraft:entity.experience_orb.pickup")
    player.setStatusMessage(Component.translate(
        "message.createdelight.satellite.waypoint_written",
        pending.request.x,
        pending.request.z,
        landing.x,
        landing.y,
        landing.z,
        satellite.energy
    ))
    player.swing()
    return {
        ok: true,
        landing: landing,
        energy: satellite.energy
    }
}

function replaceSatelliteUIText(root, id, fallbackX, fallbackY, textSupplier) {
    let oldWidget = root.getFirstWidgetById(id)
    let x = fallbackX
    let y = fallbackY
    if (oldWidget != null) {
        x = oldWidget.getSelfPositionX()
        y = oldWidget.getSelfPositionY()
        root.removeWidget(oldWidget)
    }
    let label = new LabelWidget()
    label.setId(id)
    label.setSelfPosition(x, y)
    label.setTextProvider(textSupplier)
    label.setTextColor(0xFFFFFF)
    root.addWidget(label)
    return label
}

function findMissingSatelliteUIWidgets(widgets) {
    let missing = []
    Object.keys(widgets).forEach(id => {
        if (widgets[id] == null)
            missing.push(id)
    })
    return missing
}

function replaceSatelliteDimensionSelector(root, serializedSelector, candidateNames) {
    let candidates = new global.CDServerJavaClasses.$ArrayList()
    candidateNames.forEach(name => candidates.add(name))

    let position = serializedSelector.getSelfPosition()
    let size = serializedSelector.getSize()
    let selector = new global.CDServerJavaClasses.$SelectorWidget(
        position.x,
        position.y,
        size.width,
        size.height,
        candidates,
        -1
    )
    selector.setId("target_dimension_selecter")
    selector.setButtonBackground(serializedSelector.getBackgroundTexture())
    root.removeWidget(serializedSelector)
    root.addWidget(selector)
    return selector
}

function createSatelliteNavigationUI(event) {
    if (SATELLITE_NAVIGATION_UI_CREATOR == null)
        return null

    let root = SATELLITE_NAVIGATION_UI_CREATOR.get()
    if (root == null)
        return null
    let player = event.player
    let item = event.held
    let data = readSatelliteData(player)
    let availableDimensions = getAvailableTargetDimensions(data)
    let selectableDimensions = availableDimensions
    let selectableDimensionNames = selectableDimensions.map(dimensionName)
    let tag = item.getOrCreateTag()
    let savedDimension = tag.getString(SATELLITE_CARD_DIMENSION_KEY)
    if (selectableDimensions.indexOf(savedDimension) < 0)
        savedDimension = availableDimensions.length > 0 ? availableDimensions[0] : "minecraft:overworld"

    let state = {
        status: availableDimensions.length == 0
            ? "没有可用的虚拟卫星，或导航能源已经耗尽。"
            : findSpaceAtlas(player) == null
                ? "背包中需要携带一份星图。"
                : "请输入坐标并扫描着陆点。",
        result: "尚未扫描。",
        pending: null
    }

    let widgets = {
        target_dimension_selecter: root.getFirstWidgetById("target_dimension_selecter"),
        waypoint_name_textfield: root.getFirstWidgetById("waypoint_name_textfield"),
        x_pos_textfield: root.getFirstWidgetById("x_pos_textfield"),
        z_pos_textfield: root.getFirstWidgetById("z_pos_textfield"),
        scan_button: root.getFirstWidgetById("scan_button"),
        confirm_button: root.getFirstWidgetById("confirm_button")
    }
    let missingWidgets = findMissingSatelliteUIWidgets(widgets)
    if (missingWidgets.length > 0) {
        let message = `卫星导航界面缺少必要控件：${missingWidgets.join(", ")}`
        console.error(`[Create Delight] ${message}`)
        player.setStatusMessage(Component.literal(message))
        return null
    }

    let dimensionSelector = replaceSatelliteDimensionSelector(root, widgets.target_dimension_selecter, selectableDimensionNames)
    let nameField = widgets.waypoint_name_textfield
    let xField = widgets.x_pos_textfield
    let zField = widgets.z_pos_textfield
    let scanButton = widgets.scan_button
    let confirmButton = widgets.confirm_button

    // The synchronized client mirror lets both sides build the same native selector
    // tree containing only active satellite coverage with remaining energy.
    dimensionSelector.setValue(dimensionName(savedDimension))

    let defaultLabel = tag.getString(SATELLITE_CARD_LABEL_KEY) || `${dimensionName(savedDimension)}卫星着陆点`
    let defaultX = tag.getString(SATELLITE_CARD_X_KEY) || `${Math.floor(player.x)}`
    let defaultZ = tag.getString(SATELLITE_CARD_Z_KEY) || `${Math.floor(player.z)}`
    nameField.setCurrentString(defaultLabel)
    nameField.setMaxStringLength(32)
    xField.setCurrentString(defaultX)
    xField.setMaxStringLength(9)
    zField.setCurrentString(defaultZ)
    zField.setMaxStringLength(9)

    scanButton.setButtonTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("扫描着陆点"))
    confirmButton.setButtonTexture(ResourceBorderTexture.BUTTON_COMMON, new TextTexture("写入星图"))
    replaceSatelliteUIText(root, "scan_status_text", 17, 131, () => state.status)
    replaceSatelliteUIText(root, "landing_result_text", 17, 144, () => state.result)

    scanButton.setOnPressCallback(click => {
        if (click.isRemote)
            return
        try {
            let dimension = dimensionFromName(dimensionSelector.getValue())
            let x = parseSatelliteCoordinate(xField.getCurrentString())
            let z = parseSatelliteCoordinate(zField.getCurrentString())
            if (dimension == null || x == null || z == null) {
                state.pending = null
                state.status = "请选择目标天体，并输入有效的整数 X/Z。"
                state.result = "扫描失败。"
                return
            }

            let label = `${nameField.getCurrentString()}`.trim() || `${dimensionName(dimension)}卫星着陆点`
            let request = { label: label, x: x, z: z }
            state.status = `正在扫描${dimensionName(dimension)}……`
            let result = scanSatelliteNavigation(player, dimension, request)
            if (!result.ok) {
                state.pending = null
                state.status = result.message
                state.result = "扫描失败。"
                return
            }

            state.pending = result.pending
            state.status = `扫描完成；安全评分 ${result.pending.landing.safetyScore}，请确认写入。`
            state.result = satelliteLandingSummary(dimension, request, result.pending.landing)
            tag.putString(SATELLITE_CARD_DIMENSION_KEY, dimension)
            tag.putString(SATELLITE_CARD_LABEL_KEY, label)
            tag.putString(SATELLITE_CARD_X_KEY, `${x}`)
            tag.putString(SATELLITE_CARD_Z_KEY, `${z}`)
        } catch (error) {
            state.pending = null
            state.status = "卫星扫描发生异常。"
            state.result = "扫描失败。"
            console.error(`[Create Delight] Satellite UI scan failed: ${error}`)
        }
    })

    confirmButton.setOnPressCallback(click => {
        if (click.isRemote)
            return
        try {
            if (state.pending == null) {
                state.status = "请先扫描着陆点。"
                return
            }

            let selectedDimension = dimensionFromName(dimensionSelector.getValue())
            let currentX = parseSatelliteCoordinate(xField.getCurrentString())
            let currentZ = parseSatelliteCoordinate(zField.getCurrentString())
            let currentLabel = `${nameField.getCurrentString()}`.trim() || `${dimensionName(state.pending.dimension)}卫星着陆点`
            if (selectedDimension != state.pending.dimension || currentX != state.pending.request.x || currentZ != state.pending.request.z || currentLabel != state.pending.request.label) {
                state.pending = null
                state.status = "输入内容已经变化，请重新扫描。"
                state.result = "预览已失效。"
                return
            }

            let result = confirmSatelliteNavigation(player, item, state.pending)
            if (!result.ok) {
                state.status = result.message
                return
            }
            state.status = `航点已写入；卫星剩余能源 ${result.energy}。`
            state.result = `${dimensionName(selectedDimension)}：${result.landing.x}, ${result.landing.y}, ${result.landing.z}`
            state.pending = null
        } catch (error) {
            state.status = "写入星图时发生异常。"
            console.error(`[Create Delight] Satellite UI confirmation failed: ${error}`)
        }
    })

    return root
}

ItemEvents.rightClicked("createdelight:folded_mapping_satellite", event => {
    deployVirtualSatellite(event)
})

PlayerEvents.loggedIn(event => {
    syncSatelliteDataToClient(event.player)
})

ItemEvents.firstRightClicked("createdelight:satellite_navigation_data_card", event => {
    if (event.level.clientSide)
        return
    if (SATELLITE_NAVIGATION_UI_CREATOR == null) {
        event.player.setStatusMessage(Component.literal("卫星导航界面加载失败。"))
        return
    }
    let player = event.player
    let hand = event.hand
    syncSatelliteDataToClient(player)
    // KubeJS and LDLib use separate client packet handlers. Give the snapshot time
    // to populate the client player's local persistentData before building the UI.
    player.server.scheduleInTicks(2, () => {
        if (player.getItemInHand(hand).id != "createdelight:satellite_navigation_data_card")
            return
        ItemUIFactory.INSTANCE.openUI(player, hand, SATELLITE_UI_NAME)
        player.swing()
    })
})

LDLibUI.item(SATELLITE_UI_NAME, event => {
    let root = null
    try {
        root = createSatelliteNavigationUI(event)
    } catch (error) {
        console.error(`[Create Delight] Failed to create satellite navigation UI: ${error}`)
        event.player.setStatusMessage(Component.literal("卫星导航界面初始化失败，请检查日志。"))
        return
    }
    if (root == null) {
        event.player.setStatusMessage(Component.literal("卫星导航界面加载失败，请检查 UI 文件。"))
        return
    }
    event.success(root)
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
