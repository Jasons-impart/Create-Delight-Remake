
const $FluidFX = Java.loadClass("com.simibubi.create.content.fluids.FluidFX")
const $HoloGui = Java.loadClass("se.mickelus.tetra.items.modular.impl.holo.gui.HoloGui")
NetworkEvents.dataReceived("kubejs_player_playsound", e => {
    e.player.playSound(e.data.get("soundEvent").getAsString())
})

NetworkEvents.dataReceived("spawn_create_particle", e => {
    const {fluid, x, y, z, vx, vy, vz} = e.data
    let particle = $FluidFX.getFluidParticle(Fluid.of(fluid).fluid)
    
    e.player.level.addParticle(particle, x, y, z, vx, vy, vz)
})

NetworkEvents.dataReceived("openholo", e => {
    let gui = $HoloGui.getInstance()
    Client.setScreen(gui)
    gui.onShow()
})