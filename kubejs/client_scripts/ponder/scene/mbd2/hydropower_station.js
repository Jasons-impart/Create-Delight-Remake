Ponder.registry(event => {
    let steps = [
        [[4, 14, 11, 11, 14, 11], 0], [[4, 14, 10, 11, 14, 10], 7], [[4, 13, 10, 11, 13, 10], 0], [[4, 12, 10, 11, 12, 10], 0],
        [[4, 11, 10, 11, 11, 10], 0], [[4, 10, 10, 11, 10, 10], 0], [[4, 10, 9, 11, 10, 9], 7], [[4, 9, 9, 11, 9, 9], 0],
        [[4, 8, 9, 11, 8, 9], 0], [[4, 7, 9, 11, 7, 9], 0], [[4, 7, 9, 11, 7, 9], 0], [[4, 7, 8, 11, 7, 8], 7],
        [[4, 6, 8, 11, 6, 8], 0], [[4, 6, 7, 11, 6, 7], 7], [[4, 5, 7, 11, 5, 7], 0], [[4, 5, 6, 11, 5, 6], 7],
        [[4, 4, 6, 11, 4, 6], 0], [[4, 4, 5, 11, 4, 5], 7], [[4, 3, 5, 11, 3, 5], 0], [[4, 2, 5, 11, 2, 5], 0],
        [[4, 2, 4, 11, 2, 4], 0], [[4, 2, 3, 11, 2, 3], 0], [[4, 2, 2, 11, 2, 2], 7], [[4, 1, 2, 11, 1, 2], 0]
    ]
    event.create([
        "createdelight:hydropower_station",
        "createdelight:wooden_fan",
        "createdelight:steel_fan",
        "createdelight:forge_steel_fan",
        "createdelight:dragon_steel_fan"
    ])
        .scene(
            "createdelight:hydropower_station",
            "大坝！水利工程的巅峰之作！",
            "createdelight:ponder_hydropower_station",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.scaleSceneView(0.45)
                scene.idle(20)
                scene.text(40, "先让我们快速的搭建一下基础结构").attachKeyFrame()
                scene.idle(40)
                for (let i = 0; i < 14; i++) {
                    scene.world.showSection([3, i + 1, 2, 12, i + 1, 13], Direction.DOWN)
                    scene.idle(10)
                }
                scene.text(40, "OK,搭建完毕!").attachKeyFrame()
                scene.idle(40)
                scene.text(120, "现在让我们看看全貌")
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(40, "§4注意: 这里要放置大坝以作为控制器组件").attachKeyFrame()
                scene.showControls(40, [13, 2, 8.5], "up").rightClick()
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(60)
                scene.overlay.showOutline("green", {}, [4, 14, 11, 11, 14, 11], 40)
                scene.text(40, "想让大坝产出应力, 你需要在顶端倒入水").attachKeyFrame()
                scene.idle(20)
                let water = Blocks.WATER.getBlockStates()
                steps.forEach(([coords, idx]) => {
                    scene.world.setBlocks(coords, water[idx], false)
                    scene.idle(3)
                })
                PonderUtil.setKineticSpeed(scene, [3, 3, 4, 12, 3, 4], 32)
                scene.idle(40)
                steps.forEach(([coords, idx]) => {
                    scene.world.setBlocks(coords, Block.id("air"), false)
                })
                PonderUtil.setKineticSpeed(scene, [3, 3, 4, 12, 3, 4], 0)
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [4, 14, 11, 11, 14, 11], 40)
                scene.text(40, "或者你也可以倒入灵质").attachKeyFrame()
                scene.idle(20)
                let ectoplasm = Block.id("netherexp:ectoplasm").blockState
                steps.forEach(([coords, idx]) => {
                    scene.world.setBlocks(coords, ectoplasm, false)
                    scene.idle(3)
                })
                PonderUtil.setKineticSpeed(scene, [3, 3, 4, 12, 3, 4], 32)
                scene.idle(40)
                steps.forEach(([coords, idx]) => {
                    scene.world.setBlocks(coords, water[idx], false)
                    scene.idle(3)
                })
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [3, 1, 2, 12, 14, 13], 60)
                scene.text(60, "大坝结构内所有的陨石方块均可替换为陨石类方块", [3, 15, 13]).attachKeyFrame()
                scene.idle(60)
                scene.overlay.showOutline("green", {}, [4, 3, 4, 11, 3, 4], 80)
                scene.text(80, "§4注意: 不同等级的单个转子产出的应力§r\n§4从低到高分别为: 16384su, 65536su,§r\n§4131072su, 262144su", [8, 3, 4])
                scene.text(80, "大坝的涡轮转子转速固定为32RPM, 且存在四个等级, 依次为木, 钢, 锻造钢, 龙钢")
                scene.world.replaceBlocks([8, 3, 4, 9, 3, 4], Block.id("createdelight:steel_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                scene.world.replaceBlocks([6, 3, 4, 7, 3, 4], Block.id("createdelight:forge_steel_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                scene.world.replaceBlocks([4, 3, 4, 5, 3, 4], Block.id("createdelight:dragon_steel_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                PonderUtil.setKineticSpeed(scene, [3, 3, 4, 12, 3, 4], 32)
                scene.idle(40)
                scene.world.replaceBlocks([8, 3, 4, 9, 3, 4], Block.id("createdelight:wooden_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                scene.world.replaceBlocks([6, 3, 4, 7, 3, 4], Block.id("createdelight:wooden_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                scene.world.replaceBlocks([4, 3, 4, 5, 3, 4], Block.id("createdelight:wooden_fan").blockState.setValue($BlockStateProperties.HORIZONTAL_FACING, Direction.WEST), true)
                PonderUtil.setKineticSpeed(scene, [3, 3, 4, 12, 3, 4], 32)
                scene.idle(40)
                scene.text(140, "当然, 大坝也支持横向拓展, 最少1个转子, 最多13个转子, 且每个转子均可单独输出应力").attachKeyFrame()
                scene.world.hideSection([5, 1, 2, 11, 14, 13], Direction.SOUTH)
                scene.idle(20)
                let side = scene.world.makeSectionIndependent([3, 1, 2, 4, 14, 13])
                scene.world.moveSection(side, [7, 0, 0], 30)
                scene.idle(40)
                scene.world.moveSection(side, [-7, 0, 0], 20)
                scene.idle(20)
                scene.world.showSection([5, 1, 2, 11, 14, 13], Direction.NORTH)
                scene.idle(20)
                let west = scene.world.makeSectionIndependent([4, 1, 2, 7, 14, 13])
                let east = scene.world.makeSectionIndependent([8, 1, 2, 12, 14, 13])
                scene.world.moveSection(side, [-2, 0, 0], 15)
                scene.world.moveSection(west, [-2, 0, 0], 15)
                scene.world.moveSection(east, [3, 0, 0], 15)
                scene.idle(20)
                scene.world.showSection([6, 1, 2, 10, 14, 13], Direction.NORTH)
                scene.idle(20)
                scene.markAsFinished()
            })
})
