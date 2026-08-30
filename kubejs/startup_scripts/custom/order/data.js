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

CDOrderDataTarget.reloadData = function () {
    let bridge = global.CDStartupJavaClasses.$OrderDataKubeBridge
    let snapshot = cdOrderDataToJs(bridge.all())
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
