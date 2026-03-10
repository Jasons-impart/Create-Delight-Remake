
const $FluidFX = Java.loadClass("com.simibubi.create.content.fluids.FluidFX")
const $HoloGui = Java.loadClass("se.mickelus.tetra.items.modular.impl.holo.gui.HoloGui")

NetworkEvents.dataReceived("kubejs_player_playsound", e => {
    e.player.playSound(e.data.get("soundEvent").getAsString())
})

NetworkEvents.dataReceived("spawn_create_particle", e => {
    const { fluid, x, y, z, vx, vy, vz, count, speed } = e.data
    let particle = $FluidFX.getFluidParticle(Fluid.of(fluid).fluidStack)
    e.player.level.spawnParticles(particle, true, x, y, z, vx, vy, vz, count, speed)
})

NetworkEvents.dataReceived("openholo", e => {
    let gui = $HoloGui.getInstance()
    Client.setScreen(gui)
    gui.onShow()
})

// 发送玩家是否按下了Alt键并显示状态文本提示，用于 批量套壳 server_scripts/Custom/encase.js
let isAltDown = false
let wasAltDown = false
const Encasable = ['create:shaft', 'create:belt']
const Uncasingable = ["create:brass_encased_shaft", "create:andesite_encased_shaft", 'create:shaft', 'create:belt']
const beltCasing = ["create:brass_casing", "create:andesite_casing"]
PlayerEvents.tick(event => {
    isAltDown = Client.isAltDown()
    if (isAltDown != wasAltDown) {
        event.player.sendData("isPlayerAltDown", { "Alt": isAltDown })
        wasAltDown = isAltDown
    }

    if (event.level.time % 10 != 0) { return }
    let viewBlock = event.player.rayTrace(event.player.getAttributeValue("forge:block_reach") + 1, true).block
    let Item = event.player.mainHandItem
    let isCasing = false
    let isEncasable = false
    let isUncasingable = false

    if (Item != null) {
        isCasing = beltCasing.some(i => i == Item.id)
    }
    if (viewBlock != null) {
        isEncasable = Encasable.some(i => i == viewBlock.id)
        isUncasingable = Uncasingable.some(i => i == viewBlock.id)
    }

    if (!Client.isAltDown()) {
        if (isCasing && isEncasable) {
            event.player.setStatusMessage(Text.translate("message.kubejs.chainedcasing"))
            return
        }
        if ("create:wrench" == Item.id && isUncasingable) {
            event.player.setStatusMessage(Text.translate("message.kubejs.chaineduncasing"))
            return
        }
    }
})