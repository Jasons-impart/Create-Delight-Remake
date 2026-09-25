// SAR 三明治酱料属性（颜色/容器/显示名）→ JsonIO 生成 datapack JSON，本表为唯一数据源。
// 生成物 kubejs/data/.../ingredients/ 已 gitignore，勿手改。
// 必须在 startup：datapack 加载前落盘，首次进档才生效；改表后需重启。
// KubeJS 类过滤禁止 java.nio.file.* / java.io.File；Path.resolve 须用 ['resolve(java.lang.String)']；
// 顶层勿用名 Platform（会覆盖全局 Platform.isLoaded）。
let SarPlatform = Java.loadClass("dev.architectury.platform.Platform")
let SarJavaString = Java.loadClass("java.lang.String")
let SOUND_MOIST = "some_assembly_required:block.sandwich.add_item.moist"

/** 相对游戏根目录拼 Path；rel 用 "/" 分段，避免系统分隔符差异 */
function sarGameFile(rel) {
    let p = SarPlatform.getGameFolder()
    let segs = String(rel).split("/")
    for (let i = 0; i < segs.length; i++) {
        let seg = segs[i]
        if (seg.length > 0 && seg !== ".")
            p = p['resolve(java.lang.String)'](new SarJavaString(seg))
    }
    return p
}

/**
 * @param {string} item 物品 ID
 * @param {number} color 涂抹色 RGB（写入 spread 的 NBT Color）
 * @param {object} [opts]
 * @param {string|null} [opts.container=minecraft:glass_bottle] 食用后退回的容器；null=无
 * @param {string} [opts.fullName] 显示名 translate key；省略则用物品原名
 * @param {string} [opts.path] JSON 路径（相对 ingredients/）；默认取 item 的 ns/path。仅历史路径与 item 不一致时需要，如 cheese → ad_astra/cheese
 */
function spread(item, color, opts) {
    opts = opts || {}
    let path = opts.path || item.replace(":", "/")
    let container = opts.container === undefined ? "minecraft:glass_bottle" : opts.container

    let json = {}
    if (container)
        json.container = { item: container }
    json.displayItem = {
        item: "some_assembly_required:spread",
        nbt: { Color: color }
    }
    if (opts.fullName)
        json.fullName = { translate: opts.fullName }
    json.item = item
    json.soundEvent = SOUND_MOIST

    let file = sarGameFile(`kubejs/data/some_assembly_required/some_assembly_required/ingredients/${path}.json`)
    try {
        file.toFile().getParentFile().mkdirs()
    } catch (err) {
        console.error(`[sar-spread] mkdirs failed ${item}: ${err}`)
    }
    try {
        JsonIO.write(file, JsonIO.of(json).getAsJsonObject())
    } catch (err) {
        console.error(`[sar-spread] write failed ${item}: ${err}`)
    }
}

spread("trailandtales_delight:cheese_slice", 0xEDAE25, { container: null, path: "ad_astra/cheese" })
spread("trailandtales_delight:cherry_cheese_slice", 0xE878A8, { container: null })
spread("brewinandchewin:scarlet_cheese_wedge", 0xC82838, { container: null })
spread("create_bic_bit:ketchup_bottle", 0xDA4930, { fullName: "some_assembly_required.ingredient.ketchup" })
spread("create_bic_bit:mayonnaise_bottle", 0xE1E7A8, { fullName: "some_assembly_required.ingredient.mayonnaise" })
spread("createdelightcore:lush_confiture_jelly_bottle", 0xF0612E)
spread("dungeonsdelight:wardenzola_crumbles", 0x0E7A68, { container: null })
spread("ends_delight:chorus_sauce", 0x883787, { container: "minecraft:bowl" })
spread("fruitsdelight:apple_jelly", 0xA34C13)
spread("fruitsdelight:bayberry_jelly", 0x35020D)
spread("fruitsdelight:blueberry_jelly", 0x0B0240)
spread("fruitsdelight:chorus_jelly", 0xC59ECB)
spread("fruitsdelight:cranberry_jelly", 0xBF1213)
spread("fruitsdelight:durian_jelly", 0xDAB61C)
spread("fruitsdelight:fig_jelly", 0xC24502)
spread("fruitsdelight:glowberry_jelly", 0xEC9409)
spread("fruitsdelight:hamimelon_jelly", 0xEC9409)
spread("fruitsdelight:hawberry_jelly", 0x5C0201)
spread("fruitsdelight:kiwi_jelly", 0x5FCA02)
spread("fruitsdelight:lemon_jelly", 0xFCE037)
spread("fruitsdelight:lychee_jelly", 0xF4C3E4)
spread("fruitsdelight:mango_jelly", 0xFCB019)
spread("fruitsdelight:mangosteen_jelly", 0xEECBA4)
spread("fruitsdelight:melon_jelly", 0x920A05)
spread("fruitsdelight:orange_jelly", 0xEB7707)
spread("fruitsdelight:peach_jelly", 0xE2694A)
spread("fruitsdelight:pear_jelly", 0xB8C126)
spread("fruitsdelight:persimmon_jelly", 0xDE4A14)
spread("fruitsdelight:pineapple_jelly", 0xFACC1C)
spread("fruitsdelight:sweetberry_jelly", 0xA90727)
spread("the_bumblezone:royal_jelly_bottle", 0xAE32DB)
spread("vintagedelight:honey_mason_jar", 0xFC8F16, { container: "vintagedelight:mason_jar", fullName: "some_assembly_required.ingredient.honey_bottle" })
spread("vintagedelight:nut_mash_bottle", 0x96754E, { fullName: "some_assembly_required.ingredient.nut_mash" })
spread("vintagedelight:nut_mash_mason_jar", 0x96754E, { container: "vintagedelight:mason_jar", fullName: "some_assembly_required.ingredient.nut_mash" })
spread("vintagedelight:nut_milk_bottle", 0xEDD8C6, { fullName: "some_assembly_required.ingredient.nut_milk" })
spread("vintagedelight:pepper_jam_bottle", 0x9E250D, { fullName: "some_assembly_required.ingredient.pepper_jam" })
spread("vintagedelight:pepper_jam_mason_jar", 0x9E250D, { container: "vintagedelight:mason_jar", fullName: "some_assembly_required.ingredient.pepper_jam" })
spread("vintagedelight:relish_bottle", 0x6D8D0D, { fullName: "some_assembly_required.ingredient.relish" })
spread("vintagedelight:relish_mason_jar", 0x6D8D0D, { container: "vintagedelight:mason_jar", fullName: "some_assembly_required.ingredient.relish" })
spread("vintagedelight:vinegar_bottle", 0xB99A7B, { fullName: "some_assembly_required.ingredient.vinegar" })
spread("vintagedelight:vinegar_mason_jar", 0xB99A7B, { container: "vintagedelight:mason_jar", fullName: "some_assembly_required.ingredient.vinegar" })
