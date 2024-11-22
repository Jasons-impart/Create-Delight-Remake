MBDMachineEvents.onTick("mbd2:reacter_rod", e => {
    let blocks = ['create_new_age:reactor_glass', 'create_new_age:reactor_casing', 'mbd2:reactor_vent', 'mbd2:reactor']

    /**
     * 
     * @param {Internal.Level} level 
     * @param {BlockPos} pos 
     * @param {number} age 
     * @param {Map<string, number>} list 
     * @returns {Map<string, number>}
     */
    function nuclearDiffusionByAge(level, pos, age, list) {
        if (age == 0)
            return -1
        let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
        let blockFlag = false
        blocks.forEach(blockId => {
            if (level.getBlock(pos).getId() == blockId) {
                blockFlag = true
            }
        })
        if (!blockFlag) {
            list.set(`${pos.x},${pos.y},${pos.z}`, age)
            positions.forEach(position => {
                if (list.get(`${position.x},${position.y},${position.z}`) == null) {
                    nuclearDiffusionByAge(level, position, age - 1, list)
                }
            })
        }
    }

    /**
     * 
     * @param {Internal.Level} level 
     * @param {BlockPos} pos 
     * @param {number} size 
     * @param {Map<string, number>} list 
     * @returns {Map<string, number>}
     */
    function nuclearDiffusionByCount(level, pos, size, list) {
        if (list.size >= size)
            return
        let positions = [pos.above(), pos.below(), pos.north(), pos.south(), pos.east(), pos.west()]
        let blockFlag = false
        blocks.forEach(blockId => {
            if (level.getBlock(pos).getId() == blockId) {
                blockFlag = true
            }
        })
        if (!blockFlag) {
            list.set(`${pos.x},${pos.y},${pos.z}`, age)
            positions.forEach(position => {
                if (list.get(`${position.x},${position.y},${position.z}`) == null) {
                    nuclearDiffusionByAge(level, position, age - 1, list)
                }
            })
        }
    }
    const { level, pos, machineStateName } = e.event.machine
    if (machineStateName == "working") {
        /**
         * @type {Map<string, number>}
         */
        let map = new Map()
        let time = level.time
        if (time % 200 == 0) {
            nuclearDiffusionByAge(level, pos, 7, map)
            map.forEach((age, position) => {
                let poslist = position.split(",")
                let x = parseInt(poslist[0])
                let y = parseInt(poslist[1])
                let z = parseInt(poslist[2])

                let particle = Utils.particleOptions(`dust 1 0 0 1`)
                // level.spawnParticles(particle, false, x + 0.5, y + 0.5, z + 0.5, 0, 1, 0, 1, 0.5)
                level.getEntitiesWithin(AABB.of(x + 1, y + 1, z + 1, x - 1, y - 1, z - 1)).forEach(entity => {
                    if (entity.isLiving()) {
                        /**
                         * @type {Internal.LivingEntity}
                         */
                        let livingEntity = entity
                        livingEntity.potionEffects.add("alexscaves:irradiated", 12000, 4, true, true)
                    }
                })
            })
        }
    }
})