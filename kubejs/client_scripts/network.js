
NetworkEvents.dataReceived("kubejs_player_playsound", e => {
    e.player.playSound(e.data.get("soundEvent").getAsString())
})

NetworkEvents.dataReceived("spawn_create_particle", e => {
    const {particle, x, y, z, vx, vy, vz} = e.data
    /**
     * @type {Internal.FluidParticleData}
     */
    let p = Utils.particleOptions(particle)
    
    e.player.level.addParticle(p, x, y, z, vx, vy, vz)
    // console.log(particle)
})