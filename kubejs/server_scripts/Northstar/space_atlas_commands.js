// priority: 100

const SPACE_ATLAS_ITEM = "northstar:space_atlas"
const ATLAS_COMMAND_READING_ORIGIN = new global.CDServerJavaClasses.$ResourceLocation("createdelight", "command_unlock")
const ATLAS_COMMAND_READING_DAY = -2147483648

function findCommandUnlockReading(atlasPlanet) {
    let readings = atlasPlanet.readings().toArray()
    for (let i = 0; i < readings.length; i++) {
        let reading = readings[i]
        if (reading.day() == ATLAS_COMMAND_READING_DAY && reading.origin().equals(ATLAS_COMMAND_READING_ORIGIN))
            return reading
    }
    return null
}

function unlockAllAtlasPlanets(player, atlas) {
    let registry = player.level.registryAccess().registryOrThrow(global.CDServerJavaClasses.$NorthstarRegistries.PLANET)
    let planetIds = registry.keySet().toArray()
    let content = global.CDServerJavaClasses.$SpaceAtlasContent.fromTag(atlas.getOrCreateTag()).asBuilder()
    let unlocked = 0

    for (let i = 0; i < planetIds.length; i++) {
        let planetId = planetIds[i]
        let properties = registry.get(planetId)
        if (properties == null)
            continue

        let requiredScience = Number(properties.requiredScience())
        if (!Number.isFinite(requiredScience))
            continue

        let atlasPlanet = content.getPlanets().get(planetId)
        let planetBuilder = atlasPlanet == null
            ? global.CDServerJavaClasses.$AtlasPlanet.builder().planetId(planetId)
            : atlasPlanet.toBuilder()
        let wasUnlocked = (atlasPlanet == null ? 0 : atlasPlanet.science()) >= requiredScience
        let commandReading = atlasPlanet == null ? null : findCommandUnlockReading(atlasPlanet)
        // Readings are immutable records; replace our entry on the builder.
        if (commandReading != null)
            planetBuilder.getReadings().remove(commandReading)
        planetBuilder.addReading(new global.CDServerJavaClasses.$AtlasReading(
            ATLAS_COMMAND_READING_ORIGIN,
            Math.max(0, requiredScience),
            ATLAS_COMMAND_READING_DAY
        ))

        atlasPlanet = planetBuilder.calculateScience(properties.scienceDecayExp()).build()
        content.addPlanet(atlasPlanet)
        if (!wasUnlocked && atlasPlanet.science() >= requiredScience)
            unlocked++
    }

    content.build().toTag(atlas.getOrCreateTag())
    player.inventory.setChanged()
    player.containerMenu.broadcastChanges()
    return { total: planetIds.length, unlocked: unlocked }
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event

    event.register(
        Commands.literal("cd_atlas")
            .requires(source => source.hasPermission(2))
            .then(Commands.literal("unlock_all")
                .executes(context => {
                    let player = context.source.getPlayerOrException()
                    let atlas = player.mainHandItem
                    if (`${atlas.id}` != SPACE_ATLAS_ITEM) {
                        player.tell("请在主手持有星图后再执行该指令。")
                        return 0
                    }

                    let result = unlockAllAtlasPlanets(player, atlas)
                    player.tell(`星图已全解锁：共记录 ${result.total} 个天体，本次新解锁 ${result.unlocked} 个。`)
                    return 1
                })
            )
    )
})
