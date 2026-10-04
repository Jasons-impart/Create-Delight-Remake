// priority: 900

var CDOrderDataTarget = global.Order || {}
global.Order = CDOrderDataTarget

function cdOrderDataToJs(value) {
    if (value == null)
        return value
    if (value.getClass != null && `${value.getClass().getName()}`.startsWith("java.lang.")
        && isFinite(Number(value)))
        return Number(value)
    if (Array.isArray(value))
        return value.map(cdOrderDataToJs)
    if (value.entrySet != null) {
        let result = {}
        value.entrySet().forEach(entry => {
            result[`${entry.getKey()}`] = cdOrderDataToJs(entry.getValue())
        })
        return result
    }
    if (value.forEach != null && value.getClass != null && `${value.getClass().getName()}`.startsWith("java.util.")) {
        let result = []
        value.forEach(entry => result.push(cdOrderDataToJs(entry)))
        return result
    }
    return value
}

// 专用服务器环境下客户端 JVM 不会执行 CDC 的服务端数据包监听器，
// OrderDataManager 永远为空表。此时直接读取随整合包分发的 kubejs/data 文件，
// 按 OrderDataKubeBridge 的输出结构在本地重建同一份数据。
const CD_ORDER_DATA_DIR = "kubejs/data/createdelightcore/createdelightcore_order/"

function cdOrderDataReadJson(name) {
    try {
        let json = JsonIO.read(CD_ORDER_DATA_DIR + name)
        return json == null ? null : JSON.parse(`${json}`)
    } catch (error) {
        return null
    }
}

function cdOrderDataLocalSpec(spec) {
    let result = {}
    if (spec == null)
        return result
    if (spec.customer_groups != null) result.customerGroups = spec.customer_groups
    if (spec.category_groups != null) result.categoryGroups = spec.category_groups
    if (spec.required_categories != null) result.requiredCategories = spec.required_categories
    if (spec.customer_weight_bonus != null) result.customerWeightBonus = spec.customer_weight_bonus
    if (spec.category_weight_bonus != null) result.categoryWeightBonus = spec.category_weight_bonus
    if (spec.count_multiplier != null) result.countMultiplier = spec.count_multiplier
    if (spec.entry_count_multiplier != null) result.entryCountMultiplier = spec.entry_count_multiplier
    if (spec.min_quality_bonus != null) result.minQualityBonus = spec.min_quality_bonus
    if (spec.money_multiplier != null) result.moneyMultiplier = spec.money_multiplier
    if (spec.reputation_multiplier != null) result.reputationMultiplier = spec.reputation_multiplier
    return result
}

function cdOrderDataLocalSnapshot() {
    let orderTypes = cdOrderDataReadJson("order_types.json")
    if (orderTypes == null)
        return null

    let categoryGroups = {}
    let rawGroups = cdOrderDataReadJson("category_groups.json") || {}
    for (let key in rawGroups)
        categoryGroups[key] = rawGroups[key].entries || {}

    let draftSeals = {}
    let rawSeals = cdOrderDataReadJson("draft_seals.json") || {}
    for (let key in rawSeals)
        draftSeals[key] = {
            type: rawSeals[key].type,
            key: rawSeals[key].key,
            spec: cdOrderDataLocalSpec(rawSeals[key].spec)
        }

    let customers = {}
    let rawCustomers = cdOrderDataReadJson("customers.json") || {}
    for (let key in rawCustomers) {
        let value = rawCustomers[key]
        customers[key] = {
            entries: value.entries || {},
            max_count: value.max_count,
            base_continue_rate: value.base_continue_rate,
            rarity: value.rarity || "COMMON",
            chance: value.chance,
            reward: [value.reward || "", value.reward_count == null ? 1 : value.reward_count],
            reward_money: value.reward_money || 0
        }
    }

    let supplyCatalog = {}
    let rawSupply = cdOrderDataReadJson("supply_catalog.json") || {}
    for (let key in rawSupply)
        supplyCatalog[key] = {
            item: key,
            race: rawSupply[key].race,
            count: rawSupply[key].count,
            tickets: rawSupply[key].tickets,
            money: rawSupply[key].money,
            days: rawSupply[key].days
        }

    let rawMarket = cdOrderDataReadJson("market_saturation.json") || {}
    let marketSaturationConfig = {
        storageKey: rawMarket.storage_key || "createdelight_order_market_saturation",
        decayPerDay: rawMarket.decay_per_day == null ? 0.72 : rawMarket.decay_per_day,
        categoryPenalty: rawMarket.category_penalty == null ? 0.08 : rawMarket.category_penalty,
        customerPenalty: rawMarket.customer_penalty == null ? 0.05 : rawMarket.customer_penalty,
        maxBonus: rawMarket.max_bonus == null ? (rawMarket.max_penalty == null ? 0.35 : rawMarket.max_penalty) : rawMarket.max_bonus,
        categoryCompletionGain: rawMarket.category_completion_gain == null ? 0.35 : rawMarket.category_completion_gain,
        categoryCompletionScaleMax: rawMarket.category_completion_scale_max == null ? 2.0 : rawMarket.category_completion_scale_max,
        customerCompletionGain: rawMarket.customer_completion_gain == null ? 0.4 : rawMarket.customer_completion_gain,
        categoryCrossRecovery: rawMarket.category_cross_recovery == null ? 0.94 : rawMarket.category_cross_recovery,
        customerCrossRecovery: rawMarket.customer_cross_recovery == null ? 0.94 : rawMarket.customer_cross_recovery
    }

    return {
        version: 0,
        orderProperties: orderTypes,
        customerGroupPrefixes: cdOrderDataReadJson("customer_groups.json") || {},
        categoryGroups: categoryGroups,
        orderDraftSeals: draftSeals,
        marketSaturationConfig: marketSaturationConfig,
        customerProperties: customers,
        supplyCatalog: supplyCatalog
    }
}

CDOrderDataTarget.reloadData = function () {
    let bridge = global.CDStartupJavaClasses.$OrderDataKubeBridge
    let snapshot = cdOrderDataToJs(bridge.all())
    if (snapshot.orderProperties == null || Object.keys(snapshot.orderProperties).length == 0) {
        let local = cdOrderDataLocalSnapshot()
        if (local != null)
            snapshot = local
    }
    this.dataVersion = Number(snapshot.version)
    this.orderProperties = snapshot.orderProperties
    this.customerGroupPrefixes = snapshot.customerGroupPrefixes
    this.categoryGroups = snapshot.categoryGroups
    this.orderDraftSeals = snapshot.orderDraftSeals
    this.marketSaturationConfig = snapshot.marketSaturationConfig
    this.customerProperties = snapshot.customerProperties
    this.supplyCatalog = Object.values(snapshot.supplyCatalog)
    return this
}

CDOrderDataTarget.ensureDataLoaded = function () {
    let currentVersion = Number(global.CDStartupJavaClasses.$OrderDataKubeBridge.version())
    if (this.dataVersion != currentVersion)
        this.reloadData()
    return this
}

CDOrderDataTarget.reloadData()

CDOrderDataTarget.guildVoucherColor = 14464140
