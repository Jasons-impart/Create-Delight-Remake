// priority: 1000


//订单系统
//玩家通过某种方式获取到订单。订单通常包括多组方便量产的物品，完成订单后玩家会获取一定的报酬
//设计的意义是为整合包中大量食物等物品寻求用途

let Order = {}
global.Order = Order

Order.customerUnlockLevels = {
    COMMON: 1,
    UNCOMMON: 2,
    RARE: 4,
    EPIC: 6
}

Order.customerRarityRanks = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3
}

Order.gradeProfiles = {
    1: { key: "trial", minTotal: 32, maxTotal: 96, minEntries: 1, maxEntries: 1, qualityBonus: -1, maxCustomerRarity: 0, baseMoney: 100 },
    2: { key: "regular", minTotal: 64, maxTotal: 160, minEntries: 1, maxEntries: 2, qualityBonus: 0, maxCustomerRarity: 1, baseMoney: 200 },
    3: { key: "guild", minTotal: 128, maxTotal: 320, minEntries: 2, maxEntries: 3, qualityBonus: 0, maxCustomerRarity: 2, baseMoney: 400 },
    4: { key: "professional", minTotal: 192, maxTotal: 512, minEntries: 2, maxEntries: 4, qualityBonus: 0, maxCustomerRarity: 2, baseMoney: 700 },
    5: { key: "major", minTotal: 320, maxTotal: 768, minEntries: 3, maxEntries: 4, qualityBonus: 1, maxCustomerRarity: 3, baseMoney: 1100 },
    6: { key: "festival", minTotal: 512, maxTotal: 1024, minEntries: 3, maxEntries: 5, qualityBonus: 1, maxCustomerRarity: 3, baseMoney: 1700 }
}

Order.gradeWeightsByReputation = {
    1: [[1, 1]],
    2: [[1, 0.45], [2, 0.55]],
    3: [[2, 0.55], [3, 0.45]],
    4: [[2, 0.2], [3, 0.5], [4, 0.3]],
    5: [[3, 0.2], [4, 0.5], [5, 0.3]],
    6: [[4, 0.2], [5, 0.5], [6, 0.3]]
}

Order.orderClauses = {
    newcomer: {
        category: "support",
        exclusive: true,
        maxGrade: 2,
        spec: { countMultiplier: 0.25, moneyMultiplier: 2, reputationMultiplier: 0.5 }
    },
    small_trial: {
        category: "menu",
        maxGrade: 3,
        spec: { countMultiplier: 0.7, moneyMultiplier: 0.93, reputationMultiplier: 0.9, maxEntries: 1 }
    },
    lenient_acceptance: {
        category: "inspection",
        maxGrade: 3,
        spec: { minQualityBonus: -1, moneyMultiplier: 0.75, reputationMultiplier: 0.8 }
    },
    specialty_supply: {
        category: "menu",
        spec: { countMultiplier: 1.6, moneyMultiplier: 1.05, maxEntries: 1 }
    },
    banquet_assortment: {
        category: "menu",
        minGrade: 2,
        spec: { countMultiplier: 0.55, entryCountMultiplier: 1.5, moneyMultiplier: 1.1, reputationMultiplier: 1.15, minEntries: 2 }
    },
    small_premium: {
        category: "scale",
        minGrade: 2,
        spec: { countMultiplier: 0.5, minQualityBonus: 1, moneyMultiplier: 2.2, reputationMultiplier: 1.25 }
    },
    bulk_purchase: {
        category: "scale",
        minGrade: 3,
        spec: { countMultiplier: 2, moneyMultiplier: 0.9, reputationMultiplier: 1.15 }
    },
    quality_inspection: {
        category: "inspection",
        minGrade: 3,
        spec: { minQualityBonus: 1, moneyMultiplier: 1.35, reputationMultiplier: 1.25 }
    },
    reputation_priority: {
        category: "settlement",
        spec: { moneyMultiplier: 0.7, reputationMultiplier: 1.75 }
    },
    cash_settlement: {
        category: "settlement",
        spec: { moneyMultiplier: 1.35, reputationMultiplier: 0.5, rewardMultiplier: 0.25 }
    },
    urgent_delivery: {
        category: "time",
        minGrade: 3,
        spec: { timeRewardBonus: 0.35, timeRewardDecayTicks: 2 * 24000 }
    }
}

Order.getCustomerUnlockLevel = function (customer) {
    if (customer == null || customer.rarity == null)
        return 1
    let unlockLevel = this.customerUnlockLevels[customer.rarity]
    if (unlockLevel == null)
        return 1
    return unlockLevel
}

Order.toTextValue = function (value) {
    if (value == null)
        return ""
    if (value.getAsString != null)
        return `${value.getAsString()}`
    return `${value}`
}

Order.toArray = function (value) {
    if (value == null)
        return []
    let result = []
    try {
        if (value.size != null && value.get != null) {
            let size = Math.max(0, Number(value.size()) || 0)
            for (let index = 0; index < size; index++)
                result.push(this.toTextValue(value.get(index)))
            return result
        }
    } catch (ignored) {}
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++)
            result.push(this.toTextValue(value[index]))
        return result
    }
    return [this.toTextValue(value)]
}

Order.toObjectArray = function (value) {
    if (value == null)
        return []
    let result = []
    try {
        if (value.size != null && value.get != null) {
            let size = Math.max(0, Number(value.size()) || 0)
            for (let index = 0; index < size; index++)
                result.push(value.get(index))
            return result
        }
    } catch (ignored) {}
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++)
            result.push(value[index])
        return result
    }
    return [value]
}

Order.mergeSpec = function (base, addition) {
    let result = base || {}
    if (addition == null)
        return result

    if (addition.customerGroups != null)
        result.customerGroups = this.toArray(result.customerGroups).concat(this.toArray(addition.customerGroups))
    if (addition.categoryGroups != null)
        result.categoryGroups = this.toArray(result.categoryGroups).concat(this.toArray(addition.categoryGroups))
    if (addition.requiredCategories != null) {
        let requiredCategories = this.toArray(result.requiredCategories).map(value => `${value}`)
        this.toArray(addition.requiredCategories).forEach(value => {
            let category = `${value}`
            if (requiredCategories.indexOf(category) < 0)
                requiredCategories.push(category)
        })
        result.requiredCategories = requiredCategories
    }

    if (addition.customerWeightBonus != null)
        result.customerWeightBonus = Object.assign(result.customerWeightBonus || {}, addition.customerWeightBonus)
    if (addition.categoryWeightBonus != null)
        result.categoryWeightBonus = Object.assign(result.categoryWeightBonus || {}, addition.categoryWeightBonus)

    if (addition.countMultiplier != null)
        result.countMultiplier = (result.countMultiplier == null ? 1 : result.countMultiplier) * addition.countMultiplier
    if (addition.entryCountMultiplier != null)
        result.entryCountMultiplier = (result.entryCountMultiplier == null ? 1 : result.entryCountMultiplier) * addition.entryCountMultiplier
    if (addition.minQualityBonus != null)
        result.minQualityBonus = (result.minQualityBonus || 0) + addition.minQualityBonus
    if (addition.moneyMultiplier != null)
        result.moneyMultiplier = (result.moneyMultiplier == null ? 1 : result.moneyMultiplier) * addition.moneyMultiplier
    if (addition.reputationMultiplier != null)
        result.reputationMultiplier = (result.reputationMultiplier == null ? 1 : result.reputationMultiplier) * addition.reputationMultiplier
    if (addition.rewardMultiplier != null)
        result.rewardMultiplier = (result.rewardMultiplier == null ? 1 : result.rewardMultiplier) * addition.rewardMultiplier
    if (addition.timeRewardBonus != null)
        result.timeRewardBonus = Math.max(0, Number(addition.timeRewardBonus) || 0)
    if (addition.timeRewardDecayTicks != null)
        result.timeRewardDecayTicks = Math.max(1, Math.round(Number(addition.timeRewardDecayTicks) || 1))
    if (addition.marketMultiplierFloor != null)
        result.marketMultiplierFloor = Math.max(1, Math.min(2, Number(addition.marketMultiplierFloor) || 1))
    if (addition.marketGapSelection === true)
        result.marketGapSelection = true
    if (addition.minGrade != null)
        result.minGrade = Math.max(result.minGrade == null ? 1 : result.minGrade, addition.minGrade)
    if (addition.maxGrade != null)
        result.maxGrade = Math.min(result.maxGrade == null ? 6 : result.maxGrade, addition.maxGrade)
    if (addition.minEntries != null)
        result.minEntries = Math.max(result.minEntries == null ? 1 : result.minEntries, addition.minEntries)
    if (addition.maxEntries != null)
        result.maxEntries = Math.min(result.maxEntries == null ? 99 : result.maxEntries, addition.maxEntries)

    return result
}

Order.getClauseKey = function (stack) {
    if (stack == null || !stack.is("createdelight:order_clause"))
        return null
    return stack.nbt == null || stack.nbt.OrderClause == null
        ? null
        : `${stack.nbt.OrderClause}`
}

Order.getClause = function (stackOrKey) {
    let key = typeof stackOrKey == "string" ? stackOrKey : this.getClauseKey(stackOrKey)
    return key == null ? null : this.orderClauses[key]
}

Order.validateDraftClause = function (draft, clauseKey) {
    let clause = this.getClause(`${clauseKey}`)
    if (clause == null)
        return "unknown"

    clauseKey = `${clauseKey}`
    let existing = this.toArray(draft.Clauses)
        .map(value => `${value}`)
    if (existing.indexOf(clauseKey) >= 0)
        return "duplicate"
    if (existing.length >= 2)
        return "slots"
    if (clause.exclusive && existing.length > 0)
        return "incompatible"

    let minGrade = clause.minGrade == null ? 1 : clause.minGrade
    let maxGrade = clause.maxGrade == null ? 6 : clause.maxGrade
    for (let i = 0; i < existing.length; i++) {
        let other = this.getClause(existing[i])
        if (other == null)
            continue
        if (other.exclusive || other.category == clause.category)
            return "incompatible"
        minGrade = Math.max(minGrade, other.minGrade == null ? 1 : other.minGrade)
        maxGrade = Math.min(maxGrade, other.maxGrade == null ? 6 : other.maxGrade)
    }
    if (minGrade > maxGrade)
        return "grade"
    let draftGrade = draft == null || draft.Grade == null ? 0 : Math.round(Number(draft.Grade) || 0)
    if (draftGrade > 0 && (draftGrade < minGrade || draftGrade > maxGrade))
        return "grade"
    if (existing.length + 1 > 1 && maxGrade <= 2)
        return "slots"
    return null
}

Order.applyDraftClause = function (orderStack, clauseStack) {
    if (orderStack == null || clauseStack == null || !orderStack.is("createdelight:unopened_order"))
        return false

    let clauseKey = this.getClauseKey(clauseStack)
    if (clauseKey == null)
        return false

    let nbt = orderStack.nbt || {}
    let draft = nbt.OrderDraft || {}
    if (this.validateDraftClause(draft, clauseKey) != null)
        return false

    draft.Clauses = this.toArray(draft.Clauses).map(value => `${value}`).concat([clauseKey])
    this.clearDraftPreview(draft)
    nbt.OrderDraft = draft
    orderStack.nbt = nbt
    return true
}

Order.createSpecFromDraft = function (draft) {
    this.ensureDataLoaded()
    let spec = {}
    if (draft == null)
        return null

    let customerSeal = draft.customerSeal == null ? null : `${draft.customerSeal}`
    let categorySeal = draft.categorySeal == null ? null : `${draft.categorySeal}`
    let clauses = this.toArray(draft.Clauses).map(value => `${value}`)
    let draftGrade = draft.Grade == null ? 0 : Number(draft.Grade)
    let boardKind = draft.BoardKind == null ? null : `${draft.BoardKind}`
    let requiredCategories = this.toArray(draft.requiredCategories).map(value => `${value}`)
    let boardMarketMultiplier = Number(draft.BoardMarketMultiplier)
    if (draft.requiredCategory != null && requiredCategories.indexOf(`${draft.requiredCategory}`) < 0)
        requiredCategories.push(`${draft.requiredCategory}`)
    if (customerSeal == null && categorySeal == null && clauses.length == 0
        && requiredCategories.length == 0 && draftGrade <= 0)
        return null

    spec = this.mergeSpec(spec, { requiredCategories: requiredCategories })

    for (let itemId in this.orderDraftSeals) {
        let seal = this.orderDraftSeals[itemId]
        if (seal.type == "customer" && seal.key == customerSeal)
            spec = this.mergeSpec(spec, seal.spec)
        if (seal.type == "category" && seal.key == categorySeal)
            spec = this.mergeSpec(spec, seal.spec)
    }

    clauses.forEach(clauseKey => {
        let clause = this.getClause(clauseKey)
        if (clause == null)
            return
        spec = this.mergeSpec(spec, clause.spec)
        spec = this.mergeSpec(spec, {
            minGrade: clause.minGrade,
            maxGrade: clause.maxGrade
        })
    })
    if (clauses.length >= 2)
        spec.minGrade = Math.max(spec.minGrade == null ? 1 : spec.minGrade, 3)

    let sealCount = (customerSeal != null ? 1 : 0) + (categorySeal != null ? 1 : 0)
    spec.selectionPrecision = sealCount
    spec.modifiers = clauses
    if (boardKind == "adapted" && requiredCategories.length > 0)
        spec.fixedEntries = true
    if (boardKind == "opportunity" && isFinite(boardMarketMultiplier) && boardMarketMultiplier > 1)
        spec.marketMultiplierFloor = Math.max(1, Math.min(2, boardMarketMultiplier))
    if (draftGrade > 0)
        spec.grade = draftGrade
    spec.source = "draft"
    return spec
}

Order.applyDraftSeal = function (orderStack, sealStack) {
    this.ensureDataLoaded()
    if (orderStack == null || sealStack == null || !orderStack.is("createdelight:unopened_order"))
        return false
    if (!sealStack.is("createdelight:order_seal"))
        return false

    let sealKey = sealStack.nbt == null || sealStack.nbt.OrderSeal == null ? null : `${sealStack.nbt.OrderSeal}`
    let seal = sealKey == null ? null : this.orderDraftSeals[sealKey]
    if (seal == null)
        return false

    let nbt = orderStack.nbt || {}
    let draft = nbt.OrderDraft || {}
    if (seal.type == "customer")
        draft.customerSeal = seal.key
    else if (seal.type == "category")
        draft.categorySeal = seal.key
    else
        return false

    this.clearDraftPreview(draft)
    nbt.OrderDraft = draft
    orderStack.nbt = nbt
    return true
}

Order.removeDraftField = function (draft, key) {
    if (draft == null)
        return
    if (draft.remove != null)
        draft.remove(key)
    else
        delete draft[key]
}

Order.draftSeedModulus = 4294967296

Order.normalizeDraftSeed = function (value) {
    let number = Math.floor(Number(value) || 0)
    number %= this.draftSeedModulus
    return number < 0 ? number + this.draftSeedModulus : number
}

Order.createSeededRandom = function (seed) {
    let state = this.normalizeDraftSeed(seed)
    let modulus = this.draftSeedModulus
    return {
        nextFloat: function (minimum, maximum) {
            state = (state * 1664525 + 1013904223) % modulus
            let value = state / modulus
            if (minimum == null)
                return value
            if (maximum == null)
                return value * Number(minimum)
            return Number(minimum) + (Number(maximum) - Number(minimum)) * value
        }
    }
}

Order.createDraftSeed = function (player) {
    let entropy = Math.floor(Utils.random.nextFloat() * this.draftSeedModulus)
    let time = this.normalizeDraftSeed(this.getTimeRewardGameTime(player))
    let ownerText = `${player.uuid}`
    let owner = 0
    for (let index = 0; index < ownerText.length; index++)
        owner = (owner * 65599 + ownerText.charCodeAt(index)) % this.draftSeedModulus
    return this.normalizeDraftSeed(
        this.normalizeDraftSeed(entropy)
        + this.normalizeDraftSeed(time * 1664525)
        + owner
    )
}

Order.getDraftGenerationSeed = function (draft, attempt) {
    let base = this.normalizeDraftSeed(draft.GenerationSeed)
    let index = this.normalizeDraftSeed(draft.GenerationIndex)
    let retry = this.normalizeDraftSeed(attempt)
    return this.normalizeDraftSeed(
        base
        + this.normalizeDraftSeed(index * 1664525)
        + this.normalizeDraftSeed(retry * 1013904223)
    )
}

Order.clearDraftPreview = function (draft) {
    if (draft == null)
        return false
    let changed = draft.PreviewOrder != null
        || draft.PreviewAttempt != null
        || draft.PreviewSeed != null
        || draft.PreviewDataVersion != null
    this.removeDraftField(draft, "PreviewOrder")
    this.removeDraftField(draft, "PreviewAttempt")
    this.removeDraftField(draft, "PreviewSeed")
    this.removeDraftField(draft, "PreviewDataVersion")
    if (changed) {
        this.removeDraftField(draft, "GenerationSeed")
        this.removeDraftField(draft, "GenerationIndex")
    }
    return changed
}

Order.ensureDraftSeed = function (player, draft) {
    if (draft.GenerationSeed == null)
        draft.GenerationSeed = this.createDraftSeed(player)
    else
        draft.GenerationSeed = this.normalizeDraftSeed(draft.GenerationSeed)
    draft.GenerationIndex = Math.max(0, Math.floor(Number(draft.GenerationIndex) || 0))
}

Order.generateDraftOrder = function (player, draft) {
    let spec = this.createSpecFromDraft(draft)
    let attempt = 0
    while (attempt <= 20) {
        let seed = this.getDraftGenerationSeed(draft, attempt)
        let order = this.create(player, spec, this.createSeededRandom(seed))
        if (order != null && order.entries != null && order.entries.length > 0)
            return order
        attempt++
    }
    return null
}

Order.resetDraftDirections = function (orderStack) {
    if (orderStack == null || !orderStack.is("createdelight:unopened_order"))
        return false

    let nbt = orderStack.nbt || {}
    let draft = nbt.OrderDraft
    if (draft == null)
        return false

    let requiredCategories = this.toArray(draft.requiredCategories)
    let hasDirection = draft.customerSeal != null || draft.categorySeal != null
        || draft.requiredCategory != null || requiredCategories.length > 0 || draft.BoardKind != null
    if (!hasDirection)
        return false

    this.removeDraftField(draft, "customerSeal")
    this.removeDraftField(draft, "categorySeal")
    this.removeDraftField(draft, "requiredCategory")
    this.removeDraftField(draft, "requiredCategories")
    this.removeDraftField(draft, "BoardKind")
    this.removeDraftField(draft, "BoardMarketMultiplier")
    this.clearDraftPreview(draft)
    nbt.OrderDraft = draft
    orderStack.nbt = nbt
    return true
}

Order.openDraft = function (player, draftStack) {
    if (player == null || draftStack == null || !draftStack.is("createdelight:unopened_order"))
        return null

    this.ensureDataLoaded()
    let nbt = draftStack.nbt || {}
    let draft = nbt.OrderDraft || {}
    this.clearDraftPreview(draft)
    this.ensureDraftSeed(player, draft)
    nbt.OrderDraft = draft
    draftStack.nbt = nbt

    let generatedOrder = this.generateDraftOrder(player, draft)
    if (generatedOrder == null || this.toObjectArray(generatedOrder.entries).length == 0)
        return null
    let orderStack = Item.of("createdelight:order", 1, { createdelightOrderInfo: generatedOrder })
    let orderInfo = orderStack.nbt.createdelightOrderInfo
    orderInfo.acceptedGameTime = this.getTimeRewardGameTime(player)
    orderInfo.ownerName = `${player.username}`
    orderInfo.ownerUUID = `${player.uuid}`
    orderStack.nbt.createdelightOrderInfo = orderInfo

    draftStack.shrink(1)
    if (!draftStack.isEmpty()) {
        draft.GenerationIndex = Math.max(0, Math.floor(Number(draft.GenerationIndex) || 0)) + 1
        nbt.OrderDraft = draft
        draftStack.nbt = nbt
    }
    player.give(orderStack)
    return orderStack
}

Order.timeRewardConfig = {
    initialBonus: 0.25,
    decayTicks: 3 * 24000
}

Order.getTimeRewardGameTime = function (playerOrLevel) {
    let level = playerOrLevel == null ? null : (playerOrLevel.level || playerOrLevel)
    if (level == null)
        return 0
    let value = level.time
    if (typeof value == "function")
        value = value()
    value = Number(value)
    return isFinite(value) ? Math.max(0, value) : 0
}

Order.getTimeRewardModifier = function (order, playerOrLevel) {
    let generationSpec = order == null ? null : order.generationSpec
    let customBonus = generationSpec == null ? NaN : Number(generationSpec.timeRewardBonus)
    let customDecayTicks = generationSpec == null ? NaN : Number(generationSpec.timeRewardDecayTicks)
    let hasCustomPolicy = isFinite(customBonus) && customBonus >= 0
        && isFinite(customDecayTicks) && customDecayTicks > 0
    let initialBonus = hasCustomPolicy ? customBonus : Math.max(0, Number(this.timeRewardConfig.initialBonus) || 0)
    let decayTicks = hasCustomPolicy ? customDecayTicks : Math.max(1, Number(this.timeRewardConfig.decayTicks) || 1)
    let acceptedGameTime = order == null ? NaN : Number(order.acceptedGameTime)
    let currentGameTime = this.getTimeRewardGameTime(playerOrLevel)
    if (!isFinite(acceptedGameTime) || acceptedGameTime < 0 || currentGameTime < acceptedGameTime) {
        return {
            multiplier: 1,
            bonus: 0,
            elapsedTicks: 0,
            remainingTicks: 0
        }
    }

    let elapsedTicks = Math.max(0, currentGameTime - acceptedGameTime)
    let remainingRatio = Math.max(0, 1 - elapsedTicks / decayTicks)
    let bonus = initialBonus * remainingRatio
    return {
        multiplier: 1 + bonus,
        bonus: bonus,
        elapsedTicks: elapsedTicks,
        remainingTicks: Math.max(0, decayTicks - elapsedTicks),
        configuredBonus: initialBonus,
        decayTicks: decayTicks,
        customPolicy: hasCustomPolicy
    }
}

Order.marketSaturation = {}

Order.marketSaturation.getDay = function (playerOrLevel) {
    let level = playerOrLevel == null ? null : (playerOrLevel.level || playerOrLevel)
    if (level == null || level.dayTime == null)
        return 0
    return Math.floor(level.dayTime() / 24000)
}

Order.marketSaturation.createData = function (day) {
    return {
        lastDay: day,
        categories: {},
        customers: {}
    }
}

Order.marketSaturation.read = function (player) {
    let config = Order.marketSaturationConfig
    let day = this.getDay(player)
    if (player == null || player.persistentData == null)
        return this.createData(day)

    let raw = player.persistentData.getString(config.storageKey)
    if (raw == null || raw.length == 0)
        return this.createData(day)

    try {
        let data = JSON.parse(raw)
        data.categories = data.categories || {}
        data.customers = data.customers || {}
        data.lastDay = data.lastDay == null ? day : data.lastDay
        return data
    } catch (error) {
        return this.createData(day)
    }
}

Order.marketSaturation.write = function (player, data) {
    if (player == null || player.persistentData == null)
        return
    player.persistentData.putString(Order.marketSaturationConfig.storageKey, JSON.stringify(data))
}

Order.marketSaturation.decay = function (data, day) {
    let config = Order.marketSaturationConfig
    let elapsed = Math.max(0, day - (data.lastDay == null ? day : data.lastDay))
    if (elapsed <= 0) {
        data.lastDay = day
        return data
    }

    let factor = Math.pow(config.decayPerDay, elapsed)
    ;["categories", "customers"].forEach(group => {
        let values = data[group] || {}
        for (let key in values) {
            values[key] *= factor
            if (values[key] < 0.01)
                delete values[key]
        }
        data[group] = values
    })
    data.lastDay = day
    return data
}

Order.marketSaturation.getModifier = function (player, order) {
    Order.ensureDataLoaded()
    let config = Order.marketSaturationConfig
    if (player == null || order == null || order.entries == null || order.entries.length == 0)
        return this.applyPolicy(order, {
            multiplier: 1,
            bonus: 0,
            consumedBonus: 0,
            rawConsumption: 0,
            saturated: false,
            categoryPressure: 0,
            customerPressure: 0
        })

    let data = this.decay(this.read(player), this.getDay(player))
    let categoryPressure = 0
    order.entries.forEach(entry => {
        categoryPressure += data.categories[entry.id] || 0
    })
    categoryPressure /= Math.max(1, order.entries.length)

    let customerPressure = data.customers[order.type] || 0
    let maxBonus = Math.max(0, Number(config.maxBonus))
    let rawConsumption = categoryPressure * config.categoryPenalty + customerPressure * config.customerPenalty
    let consumedBonus = Math.min(maxBonus, Math.max(0, rawConsumption))
    let availableBonus = Math.max(0, maxBonus - consumedBonus)
    return this.applyPolicy(order, {
        multiplier: 1 + availableBonus,
        bonus: availableBonus,
        consumedBonus: consumedBonus,
        rawConsumption: rawConsumption,
        saturated: rawConsumption >= maxBonus - 0.0001,
        categoryPressure: categoryPressure,
        customerPressure: customerPressure
    })
}

Order.marketSaturation.applyPolicy = function (order, result) {
    if (result == null)
        return result
    let floor = order == null || order.generationSpec == null
        ? NaN
        : Number(order.generationSpec.marketMultiplierFloor)
    if (!isFinite(floor) || floor <= 1)
        return result

    floor = Math.max(1, Math.min(2, floor))
    result.marketMultiplierFloor = floor
    if (Number(result.multiplier) + 0.0001 < floor) {
        result.multiplier = floor
        result.bonus = floor - 1
        result.floorApplied = true
    }
    return result
}

Order.marketSaturation.recordCompletion = function (player, order, completionScale) {
    Order.ensureDataLoaded()
    let config = Order.marketSaturationConfig
    if (player == null || order == null || order.entries == null)
        return null

    let scaleFactor = completionScale == null ? 1 : Math.max(0, Math.min(1, Number(completionScale) || 0))
    let day = this.getDay(player)
    let data = this.decay(this.read(player), day)
    let activeCategories = {}
    order.entries.forEach(entry => {
        activeCategories[entry.id] = true
    })

    let categoryRecovery = config.categoryCrossRecovery
    let customerRecovery = config.customerCrossRecovery
    for (let id in data.categories) {
        if (activeCategories[id])
            continue
        data.categories[id] *= categoryRecovery
        if (data.categories[id] < 0.01)
            delete data.categories[id]
    }
    for (let id in data.customers) {
        if (id == order.type)
            continue
        data.customers[id] *= customerRecovery
        if (data.customers[id] < 0.01)
            delete data.customers[id]
    }

    let categoryScales = {}
    order.entries.forEach(entry => {
        let property = Order.orderProperties[entry.id]
        let baseCount = property == null ? 64 : property.base_count
        categoryScales[entry.id] = (categoryScales[entry.id] || 0) + entry.count / Math.max(1, baseCount * 4)
    })

    let categoryScaleMax = config.categoryCompletionScaleMax
    for (let id in categoryScales) {
        let scale = Math.max(1, Math.min(categoryScaleMax, categoryScales[id]))
        data.categories[id] = (data.categories[id] || 0) + config.categoryCompletionGain * scale * scaleFactor
    }
    if (order.type != null)
        data.customers[order.type] = (data.customers[order.type] || 0) + config.customerCompletionGain * scaleFactor

    this.write(player, data)
    return data
}

Order.getCustomerWeightMultiplier = function (customerKey, spec) {
    this.ensureDataLoaded()
    if (spec == null)
        return 1

    let multiplier = 1
    let groups = this.toArray(spec.customerGroups)
    if (groups.length > 0) {
        let matched = groups.some(group => {
            let prefix = this.customerGroupPrefixes[`${group}`]
            return prefix != null && `${customerKey}`.startsWith(prefix)
        })
        multiplier *= matched ? 4 : 0.35
    }

    let directBonus = spec.customerWeightBonus != null ? spec.customerWeightBonus[customerKey] : null
    if (directBonus != null)
        multiplier *= directBonus

    return multiplier
}

Order.getEntryWeightMultiplier = function (entryKey, spec) {
    this.ensureDataLoaded()
    if (spec == null)
        return 1

    let multiplier = 1
    let groups = this.toArray(spec.categoryGroups)
    if (groups.length > 0) {
        let matchedWeight = 0
        groups.forEach(group => {
            let groupMap = this.categoryGroups[`${group}`]
            if (groupMap != null && groupMap[entryKey] != null)
                matchedWeight = Math.max(matchedWeight, groupMap[entryKey])
        })
        multiplier *= matchedWeight > 0 ? matchedWeight : 0.35
    }

    let directBonus = spec.categoryWeightBonus != null ? spec.categoryWeightBonus[entryKey] : null
    if (directBonus != null)
        multiplier *= directBonus

    return multiplier
}

Order.marketSaturation.pickUnderSuppliedCategory = function (player, grade, spec, requiredCategories, rng) {
    Order.ensureDataLoaded()
    if (player == null)
        return null

    let reputationLevel = Order.reputation.getLevel(player)
    let gradeProfile = Order.gradeProfiles[grade] || Order.gradeProfiles[1]
    let required = Order.toArray(requiredCategories).map(value => `${value}`)
    let data = this.decay(this.read(player), this.getDay(player))
    let candidates = {}

    for (let customerKey in Order.customerProperties) {
        if (!Object.prototype.hasOwnProperty.call(Order.customerProperties, customerKey))
            continue
        let customer = Order.customerProperties[customerKey]
        if (customer.max_count < required.length + 1)
            continue
        if (required.some(category => customer.entries[category] == null))
            continue
        let unlockLevel = Order.getCustomerUnlockLevel(customer)
        if (reputationLevel < unlockLevel)
            continue
        let rarityRank = Order.customerRarityRanks[customer.rarity] == null
            ? 0 : Order.customerRarityRanks[customer.rarity]
        if (rarityRank > gradeProfile.maxCustomerRarity)
            continue

        let customerWeight = Math.max(0, Number(customer.chance) || 0)
        customerWeight *= 1 + Math.max(0, reputationLevel - unlockLevel) * 0.15
        customerWeight *= Order.getCustomerWeightMultiplier(customerKey, spec)
        if (customerWeight <= 0)
            continue

        for (let category in customer.entries) {
            if (!Object.prototype.hasOwnProperty.call(customer.entries, category)
                || required.indexOf(category) >= 0 || Order.orderProperties[category] == null)
                continue
            let entryValue = customer.entries[category]
            let entryWeight = Array.isArray(entryValue) ? Number(entryValue[0]) : Number(entryValue)
            entryWeight = Math.max(0, entryWeight || 0) * Order.getEntryWeightMultiplier(category, spec)
            if (entryWeight <= 0)
                continue
            if (candidates[category] == null) {
                candidates[category] = {
                    key: category,
                    pressure: Math.max(0, Number(data.categories[category]) || 0),
                    weight: 0
                }
            }
            candidates[category].weight += customerWeight * entryWeight
        }
    }

    let values = Object.keys(candidates).map(key => candidates[key])
    if (values.length == 0)
        return null
    let minimumPressure = values.reduce((minimum, value) => Math.min(minimum, value.pressure), Infinity)
    let scarce = values.filter(value => value.pressure <= minimumPressure + 0.05)
    let totalWeight = 0
    scarce.forEach(value => totalWeight += Math.max(0, value.weight))
    if (totalWeight <= 0)
        return scarce[0].key

    let random = rng == null ? Utils.random : rng
    let roll = random.nextFloat() * totalWeight
    for (let i = 0; i < scarce.length; i++) {
        roll -= Math.max(0, scarce[i].weight)
        if (roll <= 0)
            return scarce[i].key
    }
    return scarce[scarce.length - 1].key
}

Order.chooseGrade = function (reputationLevel, spec, rng) {
    let minGrade = spec != null && spec.minGrade != null ? Math.max(1, Math.round(spec.minGrade)) : 1
    let maxGrade = spec != null && spec.maxGrade != null ? Math.min(6, Math.round(spec.maxGrade)) : 6
    if (spec != null && spec.grade != null)
        return Math.max(minGrade, Math.min(maxGrade, Math.round(Number(spec.grade))))

    let weights = this.gradeWeightsByReputation[reputationLevel] || this.gradeWeightsByReputation[1]
    let filtered = weights.filter(value => value[0] >= minGrade && value[0] <= maxGrade)
    if (filtered.length == 0)
        return Math.max(minGrade, Math.min(maxGrade, reputationLevel))

    let total = 0
    filtered.forEach(value => total += value[1])
    let randomSource = rng == null ? Utils.random : rng
    let random = randomSource.nextFloat() * total
    for (let i = 0; i < filtered.length; i++) {
        random -= filtered[i][1]
        if (random <= 0)
            return filtered[i][0]
    }
    return filtered[filtered.length - 1][0]
}

/**
 * 根据玩家来生成订单
 * @param {Internal.Player} player
 * @param {Object=} spec
 */
Order.create = function (player, spec, rng) {
    this.ensureDataLoaded()
    let random = rng == null ? Utils.random : rng
    let level = this.reputation.getLevel(player);
    let grade = this.chooseGrade(level, spec, random)
    let gradeProfile = this.gradeProfiles[grade]
    let order = {
        entries: [],
        orderGrade: grade,
        modifiers: spec == null ? [] : this.toArray(spec.modifiers),
        generatedReputationLevel: level,
        acceptedGameTime: this.getTimeRewardGameTime(player),
        ownerName: `${player.username}`,
        ownerUUID: `${player.uuid}`
    };
    let selected;
    let requiredCategories = spec == null ? [] : this.toArray(spec.requiredCategories)
        .filter((value, index, values) => values.indexOf(value) == index)
    let marketGapCategory = null
    if (spec != null && spec.marketGapSelection === true) {
        marketGapCategory = this.marketSaturation.pickUnderSuppliedCategory(
            player,
            grade,
            spec,
            requiredCategories,
            random
        )
        if (marketGapCategory != null && requiredCategories.indexOf(marketGapCategory) < 0)
            requiredCategories.push(marketGapCategory)
    }
    if (requiredCategories.some(value => this.orderProperties[value] == null))
        return order

    // --- 根据 chance 加权随机选择客户类型 ---
    let weightedList = [];
    let totalWeight = 0;

    for (let key in Order.customerProperties) {
        if (!Object.prototype.hasOwnProperty.call(Order.customerProperties, key)) continue;
        let element = Order.customerProperties[key];
        if (element.max_count < requiredCategories.length) continue;
        if (requiredCategories.some(category => element.entries[category] == null)) continue;
        let unlockLevel = Order.getCustomerUnlockLevel(element);
        if (level < unlockLevel) continue;
        let rarityRank = Order.customerRarityRanks[element.rarity] == null ? 0 : Order.customerRarityRanks[element.rarity]
        if (rarityRank > gradeProfile.maxCustomerRarity) continue;
        let weight = element.chance * (1 + Math.max(0, level - unlockLevel) * 0.15);
        weight *= Order.getCustomerWeightMultiplier(key, spec);
        if (weight > 0) {
            let entry = { key: key, element: element, weight: weight };
            weightedList.push(entry);
            totalWeight += weight;
        }
    }

    if (weightedList.length > 0) {
        let r = random.nextFloat() * totalWeight;
        for (let i = 0; i < weightedList.length; i++) {
            r -= weightedList[i].weight;
            if (r <= 0) {
                selected = weightedList[i].element;
                order.type = weightedList[i].key;
                break;
            }
        }
    }

    if (!selected) return order;

    // --- 准备条目权重列表 ---
    const entriesList = [];
    let totalEntryWeight = 0;
    for (const key in selected.entries) {
        if (!Object.prototype.hasOwnProperty.call(selected.entries, key)) continue;
        let entryVal = selected.entries[key];
        let weight, minQuality;
        if (Array.isArray(entryVal)) {
            [weight, minQuality] = entryVal;
        } else {
            weight = entryVal;
            minQuality = 0;
        }
        weight *= Order.getEntryWeightMultiplier(key, spec);
        let entry = { key: key, weight: weight, minQuality: minQuality };
        entriesList.push(entry);
        totalEntryWeight += weight;
    }

    // --- 由订单等级决定条目数和总货量，条目按权重无重复抽取 ---
    let countMultiplier = spec != null && spec.countMultiplier != null ? spec.countMultiplier : 1;
    let minQualityBonus = spec != null && spec.minQualityBonus != null ? spec.minQualityBonus : 0;
    let entryCountMultiplier = spec != null && spec.entryCountMultiplier != null ? spec.entryCountMultiplier : 1;
    let profileMinEntries = gradeProfile.minEntries
    let profileMaxEntries = Math.min(gradeProfile.maxEntries, selected.max_count, entriesList.length)
    let targetEntryCount
    if (spec != null && spec.fixedEntries === true && requiredCategories.length > 0) {
        targetEntryCount = requiredCategories.length
    } else {
        let baseEntryCount = Math.floor(random.nextFloat(profileMinEntries, profileMaxEntries + 1))
        targetEntryCount = Math.max(1, Math.round(baseEntryCount * entryCountMultiplier))
        if (spec != null && spec.minEntries != null)
            targetEntryCount = Math.max(targetEntryCount, Math.round(spec.minEntries))
        if (spec != null && spec.maxEntries != null)
            targetEntryCount = Math.min(targetEntryCount, Math.round(spec.maxEntries))
        targetEntryCount = Math.max(1, Math.min(targetEntryCount, selected.max_count, entriesList.length))
    }

    let selectedEntries = []
    let missingRequiredCategory = false
    requiredCategories.forEach(category => {
        let requiredEntry = entriesList.find(entry => entry.key == category)
        if (requiredEntry != null)
            selectedEntries.push(requiredEntry)
        else
            missingRequiredCategory = true
    })
    if (missingRequiredCategory)
        return order
    let availableEntries = entriesList.filter(entry => requiredCategories.indexOf(entry.key) < 0)
    targetEntryCount = Math.max(targetEntryCount, selectedEntries.length)
    targetEntryCount = Math.min(targetEntryCount, selected.max_count, entriesList.length)
    while (selectedEntries.length < targetEntryCount && availableEntries.length > 0) {
        let availableWeight = 0
        availableEntries.forEach(value => availableWeight += Math.max(0, value.weight))
        if (availableWeight <= 0)
            break
        let r = random.nextFloat() * availableWeight;
        let chosenEntry;
        let chosenIndex = -1
        for (let i = 0; i < availableEntries.length; i++) {
            r -= availableEntries[i].weight;
            if (r <= 0) {
                chosenEntry = availableEntries[i];
                chosenIndex = i
                break;
            }
        }
        if (!chosenEntry)
            break
        selectedEntries.push(chosenEntry)
        availableEntries.splice(chosenIndex, 1)
    }

    let targetTotal = random.nextFloat(gradeProfile.minTotal, gradeProfile.maxTotal) * countMultiplier
    let targetUnits = Math.max(selectedEntries.length, Math.round(targetTotal / 4))
    let allocationWeights = []
    let allocationWeightTotal = 0
    selectedEntries.forEach(chosenEntry => {
        let property = Order.orderProperties[chosenEntry.key]
        let weight = Math.max(1, property == null ? 16 : property.base_count) * random.nextFloat(0.8, 1.2)
        allocationWeights.push(weight)
        allocationWeightTotal += weight
    })

    let remainingUnits = targetUnits
    selectedEntries.forEach((chosenEntry, index) => {
        let remainingEntries = selectedEntries.length - index - 1
        let units = remainingUnits
        if (remainingEntries > 0) {
            units = Math.max(1, Math.round(targetUnits * allocationWeights[index] / allocationWeightTotal))
            units = Math.min(units, remainingUnits - remainingEntries)
        }
        remainingUnits -= units
        order.entries.push({
            id: chosenEntry.key,
            count: units * 4,
            minQuality: Math.min(3, Math.max(chosenEntry.minQuality + gradeProfile.qualityBonus + minQualityBonus, 1))
        });
    })

    let moneyMultiplier = spec != null && spec.moneyMultiplier != null ? spec.moneyMultiplier : 1
    let reputationMultiplier = spec != null && spec.reputationMultiplier != null ? spec.reputationMultiplier : 1
    let rewardMultiplier = spec != null && spec.rewardMultiplier != null ? spec.rewardMultiplier : 1

    if (spec != null) {
        order.generationSpec = {
            source: spec.source || "direct",
            customerGroups: this.toArray(spec.customerGroups),
            categoryGroups: this.toArray(spec.categoryGroups),
            requiredCategories: requiredCategories,
            fixedEntries: spec.fixedEntries === true,
            selectionPrecision: spec.selectionPrecision || 0,
            modifiers: this.toArray(spec.modifiers),
            orderGrade: grade,
            marketGapCategory: marketGapCategory
        }
        if (spec.timeRewardBonus != null && isFinite(Number(spec.timeRewardBonus)))
            order.generationSpec.timeRewardBonus = Math.max(0, Number(spec.timeRewardBonus))
        if (spec.timeRewardDecayTicks != null && isFinite(Number(spec.timeRewardDecayTicks)))
            order.generationSpec.timeRewardDecayTicks = Math.max(1, Math.round(Number(spec.timeRewardDecayTicks)))
        if (spec.marketMultiplierFloor != null && isFinite(Number(spec.marketMultiplierFloor)))
            order.generationSpec.marketMultiplierFloor = Math.max(1, Math.min(2, Number(spec.marketMultiplierFloor)))
    }

    if (spec != null || moneyMultiplier != 1 || reputationMultiplier != 1 || rewardMultiplier != 1) {
        order.rewardMultipliers = {
            money: moneyMultiplier,
            reputation: reputationMultiplier,
            gifts: rewardMultiplier
        }
    }

    return order;
};



/**
 * @param {ItemStackTransfer} items
 * @returns {ItemStackTransfer} 
 */
Order.convertPackageToItemHandler = function (items) {
    let unpacked = []
    for (let index = 0; index < items.getSlots(); index++) {
        let item = items.getStackInSlot(index)
        if (item.isEmpty())
            continue

        let packageCount = Math.max(0, item.count)
        for (let packageIndex = 0; packageIndex < packageCount; packageIndex++) {
            global.CDStartupJavaClasses.$PackageItem.getContents(item.copyWithCount(1)).allItems.forEach(content => {
                if (!content.isEmpty())
                    unpacked.push(content.copy())
            })
        }
    }

    let transfer = new ItemStackTransfer()
    transfer.setSize(Math.max(1, unpacked.length))
    unpacked.forEach(content => {
        let remainder = ItemTransferHelper.insertItemStacked(transfer, content, false)
        if (!remainder.isEmpty())
            console.error(`[Order] Package conversion overflowed with ${remainder.id} x${remainder.count}`)
    })
    return transfer
}

/**
 * 只读分析单张订单的包裹履约进度，不消耗原包裹，也不计算最终 Score。
 * 最终完成与结算仍以 checkAllPackages 为唯一权威。
 * @param {{type: string, entries: [{ id: string, count: number, minQuality: number }]}} order
 * @param {ItemStackTransfer} items
 */
Order.analyzePackages = function (order, items) {
    let transfer = Order.convertPackageToItemHandler(items)
    let result = {
        matched: 0,
        required: 0,
        remaining: 0,
        qualityRejected: 0,
        progress: 0,
        complete: false,
        entries: []
    }
    if (order == null || order.entries == null)
        return result

    let seenEntryIds = {}
    order.entries.forEach(requiredEntry => {
        let id = `${requiredEntry.id}`
        seenEntryIds[id] = (seenEntryIds[id] || 0) + 1
        let required = Math.max(0, Number(requiredEntry.count) || 0)
        let remaining = required
        let rejected = 0
        let minQuality = Math.max(1, Number(requiredEntry.minQuality) || 1)

        for (let slot = 0; slot < transfer.getSlots(); slot++) {
            let stack = transfer.getStackInSlot(slot)
            if (stack.isEmpty() || !stack.hasTag("createdelight:order/" + id))
                continue

            let foodQuality = Order.getGoodsOrderProperty(stack, id) || 1
            if (foodQuality < minQuality) {
                rejected += stack.getCount()
                continue
            }

            let take = Math.min(remaining, stack.getCount())
            if (take <= 0)
                continue
            stack.shrink(take)
            remaining -= take
            if (remaining <= 0)
                break
        }

        let matched = required - remaining
        result.required += required
        result.matched += matched
        result.remaining += remaining
        result.qualityRejected += rejected
        result.entries.push({
            id: id,
            key: seenEntryIds[id] == 1 ? id : `${id}#${seenEntryIds[id]}`,
            required: required,
            matched: matched,
            remaining: remaining,
            minQuality: minQuality,
            qualityRejected: rejected,
            progress: required <= 0 ? 1 : matched / required
        })
    })

    result.progress = result.required <= 0 ? 0 : Math.min(1, result.matched / result.required)
    result.complete = result.required > 0 && result.remaining <= 0
    return result
}

/**
 * 检查多个订单是否依次可完成（共用扣减的库存），返回正负表示匹配与否
 * @param {{type: string, entries: [{ id: string, count: number, minQuality: number }]}[]} orders
 * @param {ItemStackTransfer} items
 * @returns {number[]} 正数=完全匹配产出量，0=不完全匹配产出量
 */
Order.checkAllPackages = function (orders, items) {
    let transfer = Order.convertPackageToItemHandler(items);
    let results = [];

    // 计算条目内部“物品分布”的奖励：基尼系数 G = 1 - sum(p_i^2)，typeBonus = 1 + G ∈ [1,2)
    function calcTypeBonus(countByType) {
        let total = 0;
        for (let k in countByType) total += countByType[k];
        if (total <= 0) return 1;

        let sumSquares = 0;
        for (let k in countByType) {
            let p = countByType[k] / total;
            sumSquares += p * p;
        }
        let gini = 1 - sumSquares;
        return 1 + gini;
    }

    orders.forEach(order => {
        if (order == null) {
            results.push(0);
            return;
        }

        let seenEntryIds = {}
        let needed = order.entries.map(e => {
            seenEntryIds[e.id] = (seenEntryIds[e.id] || 0) + 1
            return {
                id: e.id,
                key: seenEntryIds[e.id] == 1 ? e.id : `${e.id}#${seenEntryIds[e.id]}`,
                count: e.count,
                minQuality: e.minQuality
            }
        });

        // 每个条目记录：累计品质、数量、以及“按物品类型计数”的分布
        let entryMap = {};
        needed.forEach(req => {
            entryMap[req.key] = {
                totalQuality: 0,
                totalCount: 0,
                countByType: {}  // { typeKey: count }
            };
        });

        // 消耗库存满足条目
        needed.forEach(req => {
            for (let i = 0; i < transfer.getSlots(); i++) {
                let stack = transfer.getStackInSlot(i);
                if (!stack.isEmpty() && stack.hasTag("createdelight:order/" + req.id)) {
                    let foodQuality = Order.getGoodsOrderProperty(stack, req.id) || 1;
                    if (foodQuality < req.minQuality) continue;

                    let take = Math.min(req.count, stack.getCount());
                    if (take > 0) {

                        let entry = entryMap[req.key];
                        entry.totalQuality += (foodQuality - req.minQuality + 1) * take;
                        entry.totalCount += take;

                        let typeKey = stack.id;
                        entry.countByType[typeKey] = (entry.countByType[typeKey] || 0) + take;
                        stack.shrink(take);
                        req.count -= take;

                        if (req.count <= 0) break;
                    }
                }
            }
        });

        let fullyMatched = needed.every(n => n.count <= 0);
        let output = 0;

        if (fullyMatched) {
            // 这里是关键改动：把“条目奖励”直接乘进该条目的贡献里，再做数量加权平均
            let sumWeightedWithBonus = 0;
            let totalCountAll = 0;

            for (let id in entryMap) {
                let entry = entryMap[id];
                if (entry.totalCount <= 0) continue;
                let avgQuality = entry.totalQuality / entry.totalCount;
                let typeBonus = calcTypeBonus(entry.countByType);

                sumWeightedWithBonus += avgQuality * entry.totalCount * typeBonus;
                totalCountAll += entry.totalCount;
            }

            if (totalCountAll > 0) {
                // 最终“产出量/得分” = (Σ 每条目[平均品质 × 数量 × 条目种类奖励]) / 总数量
                output = sumWeightedWithBonus / totalCountAll;
            }
        }

        results.push(output);
    });

    return results;
};
/**
 * 
 * @param {{type: string, entries: [{ id: string, count: number, minQuality: number }]}} order 
 */
Order.calculateMoneyReward = function(order) {
    this.ensureDataLoaded()
    let origin = this.customerProperties[order.type]
    if (origin == null)
        return 0
    let rarityBonus = 1
    switch (origin.rarity) {
        case "UNCOMMON":
            rarityBonus = 1.25
            break;
        case "RARE":
            rarityBonus = 1.5
            break;
        case "EPIC":
            rarityBonus = 2
            break;
        default:
            rarityBonus = 1
            break;
    }
    let chanceBonus = 1 / origin.chance
    let goodsBonus = 0
    order.entries.forEach(entry => {
        let property = this.orderProperties[entry.id]
        if (property == null)
            return
        let qualityMultiplier = 1 + 0.2 * (entry.minQuality - 1)
        let rewardWeight = Math.max(0.1, Number(property.reward_weight) || 1)
        goodsBonus += qualityMultiplier * entry.count / Math.max(1, property.base_count) * rewardWeight
    })
    let grade = Math.max(1, Math.min(6, Number(order.orderGrade || order.generationSpec?.orderGrade) || 1))
    let gradeProfile = this.gradeProfiles[grade] || this.gradeProfiles[1]
    let gradeBaseMoney = Math.max(0, Number(gradeProfile.baseMoney) || 0)
    let multiplier = order.rewardMultipliers != null && order.rewardMultipliers.money != null
        ? order.rewardMultipliers.money
        : 1
    if (order.marketSaturation != null && order.marketSaturation.multiplier > 0)
        multiplier /= order.marketSaturation.multiplier
    // Consumers keep the historical API contract and multiply this value by
    // the customer's reward_money. Normalize the fixed grade fee here so it
    // is paid exactly once, while order/clause multipliers only affect work.
    return gradeBaseMoney / Math.max(1, origin.reward_money)
        + rarityBonus * chanceBonus * goodsBonus * multiplier
}

/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {string} type
 */
Order.getGoodsOrderProperty = function (item, type) {
    let goodsMap = CreateDelight.goodsMap.get(type)
    if (goodsMap != null)
        return goodsMap(item)
    let quality = global.CDStartupJavaClasses.$OrderGoodsQuality.getQuality(item, type)
    return quality > 0 ? quality : undefined
}
/**
 * 创建订单商会凭证。交易匹配只依赖 TicketColor 与 TicketID，
 * 不写入自定义名称，避免额外 display NBT 破坏 LC 的严格匹配。
 * @param {number} count
 * @returns {Internal.ItemStack}
 */
Order.getGuildVoucher = function (count) {
    return Item.of('lightmanscurrency:ticket', Math.max(1, Number(count) || 1), `{
        TicketColor: ${Order.guildVoucherColor},
        TicketID: -10 }`)
}

Order.reputation = {}

Order.reputation.key = "order_reputation"

/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getRawValue = function(player) {
    let value = player.persistentData.getInt(this.key)
    if (value < 0) {
        player.persistentData.putInt(this.key, 0)
        return 0
    }
    return value
}

Order.reputation.setRawValue = function(player, value) {
    let beforeLevel = this.getLevelByValue(this.getRawValue(player))
    let safeValue = Math.max(0, Math.floor(value))
    player.persistentData.putInt(this.key, safeValue)
    this.ensureCertificate(player)
    let afterLevel = this.getLevelByValue(safeValue)
    if (afterLevel > beforeLevel) {
        this.notifyMachineUnlocks(player, beforeLevel, afterLevel)
        this.notifyTradeUnlocks(player, beforeLevel, afterLevel)
    }
    return safeValue
}

Order.reputation.addValue = function(player, value) {
    if (player == null)
        return 0
    return this.setRawValue(player, this.getRawValue(player) + value)
}

Order.reputation.threshold = [0, 10, 20, 40, 60, 100]

Order.reputation.getLevelByValue = function(value) {
    for (let index = this.threshold.length - 1; index >= 0; index--) {
        if (value >= this.threshold[index])
            return index + 1
    }
    return 1
}

Order.reputation.getCompletionBonus = function(order, qualityScore) {
    let completionScore = Math.max(0, qualityScore - 1)
    if (completionScore <= 0)
        return 0
    let entryFactor = 0.75 + order.entries.length * 0.5
    return Math.max(0, Math.min(6, Math.round(completionScore * entryFactor)))
}

Order.reputation.getOrderGainDetails = function(order, qualityScore) {
    Order.ensureDataLoaded()
    let customer = Order.customerProperties[order.type]
    let rarityBonus = 0
    switch (customer != null ? customer.rarity : "COMMON") {
        case "UNCOMMON":
            rarityBonus = 1
            break;
        case "RARE":
            rarityBonus = 2
            break;
        case "EPIC":
            rarityBonus = 3
            break;
        default:
            rarityBonus = 0
            break;
    }
    let entryBonus = Math.max(1, Math.round(order.entries.length * 0.5))
    let completionBonus = this.getCompletionBonus(order, qualityScore)
    let baseGain = Math.max(1, entryBonus + rarityBonus + completionBonus)
    let multiplier = order.rewardMultipliers != null && order.rewardMultipliers.reputation != null
        ? Number(order.rewardMultipliers.reputation)
        : 1
    let gain = Math.max(0, Math.round(baseGain * multiplier))
    return {
        gain: gain,
        baseGain: baseGain,
        multiplier: multiplier,
        rarityBonus: rarityBonus,
        entryBonus: entryBonus,
        completionBonus: completionBonus
    }
}

Order.reputation.getOrderGain = function(order, qualityScore) {
    return this.getOrderGainDetails(order, qualityScore).gain
}

Order.reputation.getPlayer = function(level, order) {
    if (level == null || order == null)
        return null

    function matchesOrderOwner(player) {
        if (player == null)
            return false
        if (order.ownerUUID != null && `${player.uuid}` == `${order.ownerUUID}`)
            return true
        return order.ownerName != null && `${player.username}` == `${order.ownerName}`
    }

    function findInPlayers(players) {
        let found = null
        if (players == null)
            return null
        players.forEach(player => {
            if (found == null && matchesOrderOwner(player))
                found = player
        })
        return found
    }

    let sameLevelPlayer = findInPlayers(level.getPlayers())
    if (sameLevelPlayer != null)
        return sameLevelPlayer

    let server = level.server
    if (server == null)
        return null

    let found = null

    if (order.ownerUUID != null && global.CDServerJavaClasses != null && global.CDServerJavaClasses.$UUID != null) {
        try {
            found = server.getPlayerList().getPlayer(global.CDServerJavaClasses.$UUID.fromString(`${order.ownerUUID}`))
        } catch (error) {
            found = null
        }
    }
    if (found != null)
        return found

    try {
        return findInPlayers(server.getPlayerList().getPlayers())
    } catch (error) {
        return null
    }
}

Order.reputation.awardForOrder = function(level, order, qualityScore) {
    let player = this.getPlayer(level, order)
    if (player == null)
        return null
    let details = this.getOrderGainDetails(order, qualityScore)
    let beforeLevel = this.getLevel(player)
    let value = this.addValue(player, details.gain)
    let afterLevel = this.getLevel(player)
    return {
        player: player,
        gain: details.gain,
        completionBonus: details.completionBonus,
        rarityBonus: details.rarityBonus,
        entryBonus: details.entryBonus,
        value: value,
        level: afterLevel,
        leveledUp: afterLevel > beforeLevel
    }
}

/**
 * 
 * @param {Internal.Player} player 
 */
Order.reputation.getLevel = function(player) {
    return this.getLevelByValue(this.getRawValue(player))
}

Order.reputation.certificateItem = "createdelight:order_reputation_certificate"
Order.reputation.certificateIssuedKey = "order_reputation_certificate_issued"
Order.reputation.machinePermits = [
    { key: "order_board", level: 2, item: "createdelightcore:order_board", nameKey: "block.createdelightcore.order_board", roleKey: "tooltip.createdelight.order_machine.role.order_board" },
    { key: "supply_commission_table", level: 4, item: "createdelightcore:supply_commission_table", nameKey: "block.createdelightcore.supply_commission_table", roleKey: "tooltip.createdelight.order_machine.role.supply_commission_table", guideKey: "tooltip.createdelight.order_machine.guide.supply_commission_table" },
    { key: "order_requester", level: 5, item: "createdelightcore:order_requester", nameKey: "block.createdelightcore.order_requester", roleKey: "tooltip.createdelight.order_machine.role.order_requester" },
    { key: "order_submission_port", level: 6, item: "createdelight:order_submission_port", nameKey: "block.createdelight.order_submission_port", roleKey: "tooltip.createdelight.order_machine.role.order_submission_port" }
]

Order.reputation.createCertificateNbt = function(player) {
    let level = this.getLevel(player)
    let permits = {}
    this.machinePermits.forEach(permit => {
        if (level >= permit.level)
            permits[permit.key] = 1
    })
    return {
        OrderReputationLevel: level,
        OrderCertificateOwner: `${player.uuid}`,
        OrderMachinePermits: permits
    }
}

Order.reputation.createCertificate = function(player) {
    return Item.of(this.certificateItem, 1, this.createCertificateNbt(player))
}

Order.reputation.isOwnedCertificate = function(player, stack) {
    return player != null
        && stack != null
        && stack.is(this.certificateItem)
        && stack.nbt != null
        && `${stack.nbt.OrderCertificateOwner}` == `${player.uuid}`
}

Order.reputation.findCertificate = function(player) {
    let found = null
    player.inventory.allItems.forEach(stack => {
        if (found == null && this.isOwnedCertificate(player, stack))
            found = stack
    })
    return found
}

Order.reputation.refreshCertificate = function(player, stack) {
    if (!this.isOwnedCertificate(player, stack))
        return false
    stack.nbt = this.createCertificateNbt(player)
    player.getInventory().setChanged()
    return true
}

Order.reputation.ensureCertificate = function(player) {
    if (player == null || this.getLevel(player) < 2)
        return null

    let existing = this.findCertificate(player)
    if (existing != null) {
        this.refreshCertificate(player, existing)
        return existing
    }
    if (player.persistentData.getBoolean(this.certificateIssuedKey))
        return null

    let certificate = this.createCertificate(player)
    player.give(certificate)
    player.persistentData.putBoolean(this.certificateIssuedKey, true)
    player.tell(Text.translate("message.createdelight.order_reputation_certificate.issued", this.getLevel(player)))
    return certificate
}

Order.reputation.getPermitIngredient = function(key) {
    let permits = {}
    permits[key] = 1
    return Item.of(this.certificateItem, 1, { OrderMachinePermits: permits }).weakNBT()
}

Order.reputation.notifyMachineUnlocks = function(player, beforeLevel, afterLevel) {
    this.machinePermits.forEach(permit => {
        if (permit.level > beforeLevel && permit.level <= afterLevel) {
            player.tell(Text.translate(
                "message.createdelight.order_reputation_certificate.permit_unlocked",
                permit.level,
                Text.translate(permit.nameKey)
            ))
        }
    })
}

// ItemEvents.rightClicked("minecraft:stick", e => {
//     const {player, level} = e
//     let param = new $LootParams$Builder(level).create($LootContextParamSets.EMPTY)
    
//     Utils.server.lootData.getLootTable("createdelight:orders/random_hatbag").getRandomItems(param).forEach(item => player.give(item))
//     player.tell(123)
// })
