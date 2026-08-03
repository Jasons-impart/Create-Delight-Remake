// priority: 100

function cdOrderCommandSend(source, component) {
    source.sendSuccess(() => component, false)
}

function cdOrderCommandFail(source, component) {
    source.sendFailure(component)
}

function cdOrderCommandFormat(value, digits) {
    let number = Number(value)
    if (!Number.isFinite(number))
        number = 0
    let result = number.toFixed(digits == null ? 0 : digits)
    if (result.includes("."))
        result = result.replace(/0+$/, "").replace(/\.$/, "")
    return result
}

function cdOrderCommandPlayerName(player) {
    return `${player.username}`
}

function cdOrderCommandShowHelp(source) {
    cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.header"))
    cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.reputation"))
    cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.market"))
    if (source.hasPermission(2)) {
        cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.admin.reputation"))
        cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.admin.market"))
        cdOrderCommandSend(source, Text.translate("command.createdelight.order.help.admin.generate"))
    }
    return 1
}

function cdOrderCommandShowReputation(source, player) {
    global.Order.ensureDataLoaded()
    let reputation = global.Order.reputation
    let value = reputation.getRawValue(player)
    let level = reputation.getLevelByValue(value)
    let thresholds = reputation.threshold

    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.reputation.current",
        cdOrderCommandPlayerName(player),
        value,
        level
    ))

    if (level >= thresholds.length) {
        cdOrderCommandSend(source, Text.translate("command.createdelight.order.reputation.max"))
    } else {
        let nextThreshold = thresholds[level]
        cdOrderCommandSend(source, Text.translate(
            "command.createdelight.order.reputation.next",
            Math.max(0, nextThreshold - value),
            nextThreshold
        ))
    }
    return 1
}

function cdOrderCommandTopMarketEntries(values) {
    let result = []
    Object.keys(values || {}).forEach(id => {
        let value = Number(values[id])
        if (Number.isFinite(value) && value >= 0.01)
            result.push({ id: id, value: value })
    })
    result.sort((a, b) => b.value - a.value)
    return result.slice(0, 3)
}

function cdOrderCommandShowMarket(source, player) {
    global.Order.ensureDataLoaded()
    let market = global.Order.marketSaturation
    let config = global.Order.marketSaturationConfig || {}
    let day = market.getDay(player)
    let data = market.decay(market.read(player), day)
    let categoryPenalty = Number(config.categoryPenalty || 0)
    let customerPenalty = Number(config.customerPenalty || 0)
    let decayPerDay = Number(config.decayPerDay == null ? 1 : config.decayPerDay)
    let maxPenalty = Number(config.maxPenalty || 0)
    let categories = cdOrderCommandTopMarketEntries(data.categories)
    let customers = cdOrderCommandTopMarketEntries(data.customers)

    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.market.header",
        cdOrderCommandPlayerName(player),
        cdOrderCommandFormat(decayPerDay * 100, 0),
        cdOrderCommandFormat(maxPenalty * 100, 0)
    ))

    if (categories.length == 0 && customers.length == 0) {
        cdOrderCommandSend(source, Text.translate("command.createdelight.order.market.empty"))
        return 1
    }

    categories.forEach(entry => {
        cdOrderCommandSend(source, Text.translate(
            "command.createdelight.order.market.category",
            Text.translate(`tooltip.createdelight.order.entries.${entry.id}`),
            cdOrderCommandFormat(entry.value, 2),
            cdOrderCommandFormat(entry.value * categoryPenalty * 100, 1)
        ))
    })
    customers.forEach(entry => {
        cdOrderCommandSend(source, Text.translate(
            "command.createdelight.order.market.customer",
            Text.translate(`tooltip.createdelight.order.customer.${entry.id}`),
            cdOrderCommandFormat(entry.value, 2),
            cdOrderCommandFormat(entry.value * customerPenalty * 100, 1)
        ))
    })
    return 1
}

function cdOrderCommandResetMarket(source, player) {
    let market = global.Order.marketSaturation
    market.write(player, market.createData(market.getDay(player)))
    if (global.syncOrderMarketSaturation != null)
        global.syncOrderMarketSaturation(player)
    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.admin.market.reset",
        cdOrderCommandPlayerName(player)
    ))
    return 1
}

function cdOrderCommandSetReputation(source, player, value) {
    let result = global.Order.reputation.setRawValue(player, value)
    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.admin.reputation.set",
        cdOrderCommandPlayerName(player),
        result,
        global.Order.reputation.getLevelByValue(result)
    ))
    return 1
}

function cdOrderCommandAddReputation(source, player, amount) {
    let before = global.Order.reputation.getRawValue(player)
    let result = global.Order.reputation.addValue(player, amount)
    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.admin.reputation.add",
        cdOrderCommandPlayerName(player),
        result - before,
        result,
        global.Order.reputation.getLevelByValue(result)
    ))
    return 1
}

function cdOrderCommandGenerate(source, player, grade) {
    global.Order.ensureDataLoaded()
    let spec = { source: "command_debug" }
    if (grade != null) {
        let parsedGrade = Number(grade)
        if (!Number.isFinite(parsedGrade) || parsedGrade < 1 || parsedGrade > 6) {
            cdOrderCommandFail(source, Text.translate("command.createdelight.order.admin.invalid_grade"))
            return 0
        }
        spec.grade = Math.round(parsedGrade)
    }

    let order = global.Order.create(player, spec)
    let attempts = 0
    while ((order == null || order.entries == null || order.entries.length == 0) && attempts < 20) {
        order = global.Order.create(player, spec)
        attempts++
    }
    if (order == null || order.entries == null || order.entries.length == 0) {
        cdOrderCommandFail(source, Text.translate("command.createdelight.order.admin.generate_failed"))
        return 0
    }

    player.give(Item.of("createdelight:order", 1, { createdelightOrderInfo: order }))
    cdOrderCommandSend(source, Text.translate(
        "command.createdelight.order.admin.generated",
        cdOrderCommandPlayerName(player),
        order.orderGrade,
        order.entries.length
    ))
    return 1
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event

    let adminReputation = Commands.literal("reputation")
        .then(Commands.literal("get")
            .then(Commands.argument("player", Arguments.PLAYER.create(event))
                .executes(context => cdOrderCommandShowReputation(
                    context.source,
                    Arguments.PLAYER.getResult(context, "player")
                ))
            )
        )
        .then(Commands.literal("set")
            .then(Commands.argument("player", Arguments.PLAYER.create(event))
                .then(Commands.argument("value", Arguments.INTEGER.create(event))
                    .executes(context => cdOrderCommandSetReputation(
                        context.source,
                        Arguments.PLAYER.getResult(context, "player"),
                        Arguments.INTEGER.getResult(context, "value")
                    ))
                )
            )
        )
        .then(Commands.literal("add")
            .then(Commands.argument("player", Arguments.PLAYER.create(event))
                .then(Commands.argument("amount", Arguments.INTEGER.create(event))
                    .executes(context => cdOrderCommandAddReputation(
                        context.source,
                        Arguments.PLAYER.getResult(context, "player"),
                        Arguments.INTEGER.getResult(context, "amount")
                    ))
                )
            )
        )

    let adminMarket = Commands.literal("market")
        .then(Commands.literal("get")
            .then(Commands.argument("player", Arguments.PLAYER.create(event))
                .executes(context => cdOrderCommandShowMarket(
                    context.source,
                    Arguments.PLAYER.getResult(context, "player")
                ))
            )
        )
        .then(Commands.literal("reset")
            .then(Commands.argument("player", Arguments.PLAYER.create(event))
                .executes(context => cdOrderCommandResetMarket(
                    context.source,
                    Arguments.PLAYER.getResult(context, "player")
                ))
            )
        )

    let adminGenerate = Commands.literal("generate")
        .then(Commands.argument("player", Arguments.PLAYER.create(event))
            .executes(context => cdOrderCommandGenerate(
                context.source,
                Arguments.PLAYER.getResult(context, "player"),
                null
            ))
            .then(Commands.argument("grade", Arguments.INTEGER.create(event))
                .executes(context => cdOrderCommandGenerate(
                    context.source,
                    Arguments.PLAYER.getResult(context, "player"),
                    Arguments.INTEGER.getResult(context, "grade")
                ))
            )
        )

    event.register(
        Commands.literal("cd_order")
            .executes(context => cdOrderCommandShowHelp(context.source))
            .then(Commands.literal("help")
                .executes(context => cdOrderCommandShowHelp(context.source))
            )
            .then(Commands.literal("reputation")
                .executes(context => cdOrderCommandShowReputation(
                    context.source,
                    context.source.getPlayerOrException()
                ))
            )
            .then(Commands.literal("market")
                .executes(context => cdOrderCommandShowMarket(
                    context.source,
                    context.source.getPlayerOrException()
                ))
            )
            .then(Commands.literal("admin")
                .requires(source => source.hasPermission(2))
                .then(adminReputation)
                .then(adminMarket)
                .then(adminGenerate)
            )
    )
})
