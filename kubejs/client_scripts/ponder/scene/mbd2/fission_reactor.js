const $ACParticleRegistry = Java.loadClass("com.github.alexmodguy.alexscaves.client.particle.ACParticleRegistry")
Ponder.registry(event => {

    event.create([
        "createdelight:fission_fuel_assembly",
        "createdelight:fission_reactor",
        "createdelight:fission_reactor_controller"
    ])
        .scene(
            "createdelight:fission_reactor",
            "裂变反应堆的搭建",
            "createdelight:ponder_fission_reactor",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.scaleSceneView(0.6)
                scene.idle(20)
                scene.text(40, "先让我们快速的搭建一下基础结构").attachKeyFrame()
                scene.idle(40)
                for (let i = 0; i < 11; i++) {
                    scene.world.showSection([2, i + 1, 2, 10, i + 1, 11], Direction.DOWN)
                    scene.idle(10)
                }
                scene.world.showSection([5, 1, 1, 7, 2, 1], Direction.SOUTH)
                scene.idle(10)
                scene.text(40, "OK,搭建完毕!").attachKeyFrame()
                scene.idle(40)
                scene.text(80, "现在让我们看看全貌")
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(40, "在这个多方块结构中, 所有的锻造钢机壳都可以被锻造钢输入/输出总线代替, 也可以替换成逻辑端口来进行控制", [2, 2.5, 6.5]).attachKeyFrame()
                scene.world.replaceBlocks([2, 1, 6], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.world.replaceBlocks([2, 2, 6], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.text(40, "在这个多方块结构中, 所有的锻造钢机壳都可以被锻造钢输入/输出总线代替, 也可以替换成逻辑端口来进行控制", [11, 2.5, 6.5])
                scene.world.replaceBlocks([10, 1, 6], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.world.replaceBlocks([10, 2, 6], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.idle(40)
                scene.rotateCameraY(-180)
                scene.text(40, "在这个多方块结构中, 所有的锻造钢机壳都可以被锻造钢输入/输出总线代替, 也可以替换成逻辑端口来进行控制", [6.5, 2.5, 11])
                scene.world.replaceBlocks([6, 1, 10], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.SOUTH), true)
                scene.world.replaceBlocks([6, 2, 10], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.SOUTH), true)
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.overlay.showOutline("green", {}, [5, 3, 2, 7, 4, 2], 40)
                scene.overlay.showOutline("green", {}, [2, 3, 5, 2, 4, 7], 40)
                scene.overlay.showOutline("green", {}, [10, 3, 5, 10, 4, 7], 40)
                scene.overlay.showOutline("green", {}, [5, 3, 2, 7, 4, 2], 40)
                scene.text(40, "这些核反应堆玻璃也可以替换成核反应堆砖块", [2, 3.5, 6.5]).attachKeyFrame()
                scene.world.replaceBlocks([5, 3, 2, 7, 4, 2], Block.id("create_new_age:reactor_casing").blockState, true)
                scene.world.replaceBlocks([2, 3, 5, 2, 4, 7], Block.id("create_new_age:reactor_casing").blockState, true)
                scene.world.replaceBlocks([10, 3, 5, 10, 4, 7], Block.id("create_new_age:reactor_casing").blockState, true)
                scene.world.replaceBlocks([5, 3, 10, 7, 4, 10], Block.id("create_new_age:reactor_casing").blockState, true)
                scene.idle(40)
                scene.world.replaceBlocks([5, 3, 2, 7, 4, 2], Block.id("create_new_age:reactor_glass").blockState, false)
                scene.world.replaceBlocks([2, 3, 5, 2, 4, 7], Block.id("create_new_age:reactor_glass").blockState, false)
                scene.world.replaceBlocks([10, 3, 5, 10, 4, 7], Block.id("create_new_age:reactor_glass").blockState, false)
                scene.world.replaceBlocks([5, 3, 10, 7, 4, 10], Block.id("create_new_age:reactor_glass").blockState, false)
                scene.idle(40)
                scene.world.hideSection([2, 2, 3, 2, 5, 9], Direction.WEST)
                scene.world.hideSection([3, 3, 4, 3, 5, 4], Direction.WEST)
                scene.world.hideSection([3, 3, 8, 3, 5, 8], Direction.WEST)
                scene.world.hideSection([3, 2, 2, 9, 5, 2], Direction.NORTH)
                scene.world.hideSection([4, 3, 3, 4, 5, 3], Direction.NORTH)
                scene.world.hideSection([8, 3, 3, 8, 5, 3], Direction.NORTH)
                // scene.world.hideSection([10, 2, 3, 10, 7, 9], Direction.EAST)
                // scene.world.hideSection([9, 3, 4, 9, 5, 4], Direction.EAST)
                // scene.world.hideSection([9, 3, 8, 9, 5, 8], Direction.EAST)
                // scene.world.hideSection([3, 2, 10, 9, 7, 10], Direction.SOUTH)
                // scene.world.hideSection([4, 3, 9, 4, 5, 9], Direction.SOUTH)
                // scene.world.hideSection([8, 3, 9, 8, 5, 9], Direction.SOUTH)
                scene.world.hideSection([2, 6, 2, 10, 10, 10], Direction.UP)
                scene.world.hideSection([3, 3, 3, 3, 5, 3], Direction.UP)
                // scene.world.hideSection([3, 3, 9, 3, 5, 9], Direction.UP)
                // scene.world.hideSection([9, 3, 3, 9, 5, 3], Direction.UP)
                // scene.world.hideSection([9, 3, 9, 9, 5, 9], Direction.UP)
                scene.world.hideSection([6, 5, 6], Direction.UP)
                scene.text(40, "反应堆内部放置的核裂变燃料组件是可以变化的").attachKeyFrame()
                scene.idle(40)
                scene.text(40, "其中这两个燃料组件不可或缺", [6, 4, 6.5])
                scene.overlay.showOutline("red", {}, [6, 3, 6, 6, 4, 6], 40)
                scene.idle(40)
                scene.text(40, "其余位置的燃料组件按照你的需求来放置")
                for (let z = 3; z < 5; z++) {
                    for (let x = 3; x < 10; x++) {
                        for (let y = 3; y < 10; y++) {
                            let excludedPos = [
                                [6, 6], [3, 3], [3, 4], [4, 3],
                                [3, 8], [3, 9], [4, 9], [8, 3],
                                [9, 3], [9, 4], [9, 9], [8, 9], [9, 8]
                            ]
                            if (!excludedPos.some(pos => pos[0] == x && pos[1] == y)) {
                                scene.world.setBlocks([x, z, y], Block.id("createdelight:fission_fuel_assembly").blockState, true)
                                scene.idle(1)
                            }
                        }
                    }
                }
                scene.overlay.showOutline("green", {}, [3, 3, 3, 9, 4, 9], 40)
                scene.text(40, "最多可放置到74个", [6.5, 5, 6.5])
                scene.idle(40)
                scene.world.showSection([2, 2, 3, 2, 5, 9], Direction.EAST)
                scene.world.showSection([3, 3, 4, 3, 5, 4], Direction.EAST)
                scene.world.showSection([3, 3, 8, 3, 5, 8], Direction.EAST)
                scene.world.showSection([3, 2, 2, 9, 5, 2], Direction.SOUTH)
                scene.world.showSection([4, 3, 3, 4, 5, 3], Direction.SOUTH)
                scene.world.showSection([8, 3, 3, 8, 5, 3], Direction.SOUTH)
                // scene.world.showSection([10, 2, 3, 10, 7, 9], Direction.WEST)
                // scene.world.showSection([9, 3, 4, 9, 5, 4], Direction.WEST)
                // scene.world.showSection([9, 3, 8, 9, 5, 8], Direction.WEST)
                // scene.world.showSection([3, 2, 10, 9, 7, 10], Direction.NORTH)
                // scene.world.showSection([4, 3, 9, 4, 5, 9], Direction.NORTH)
                // scene.world.showSection([8, 3, 9, 8, 5, 9], Direction.NORTH)
                scene.world.showSection([2, 6, 2, 10, 10, 10], Direction.DOWN)
                scene.world.showSection([3, 3, 3, 3, 5, 3], Direction.DOWN)
                // scene.world.showSection([3, 3, 9, 3, 5, 9], Direction.DOWN)
                // scene.world.showSection([9, 3, 3, 9, 5, 3], Direction.DOWN)
                // scene.world.showSection([9, 3, 9, 9, 5, 9], Direction.DOWN)
                scene.world.showSection([6, 5, 6], Direction.DOWN)
                scene.idle(40)
                scene.text(40, "☢️§4注意§r☢️! §4温度过高时核反应堆会爆炸！").attachKeyFrame()
                scene.idle(40)
                // scene.playSound("alexscaves:nuclear_explosion", 1, 1)
                // scene.playSound("alexscaves:nuclear_explosion_ringing", 1, 1)
                // scene.playSound("alexscaves:nuclear_explosion_rumble", 1, 1)
                // scene.world.createEntity(level => {
                //     return level.playLocalSound([6, 3, 6], "alexscaves:nuclear_explosion", "ambient", 1, 1, true)
                // })
                scene.effects.emitParticles(
                    [6, 3, 6],
                    scene.effects.simpleParticleEmitter($ACParticleRegistry.MUSHROOM_CLOUD.get(), [0, 0, 0]), 1, 1
                )
                scene.idle(10)
                scene.world.replaceBlocks([0, 1, 0, 13, 10, 13], Block.id("minecraft:air").blockState, true)
                scene.idleSeconds(6)
                scene.markAsFinished()
            })
})