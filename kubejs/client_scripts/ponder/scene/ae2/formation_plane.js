Ponder.registry(e => {
    e.create("ae2:formation_plane")
        .scene(
            "createdelight:formation_plane",
            "成型面板的使用",
            "createdelight:ponder_formation_plane", 
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([0, 1, 0, 6, 1, 6], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "成型面板可以输入进网络的物料以掉落物或者方块形式输出到世界上")
                scene.idle(80)
                scene.world.showSection([3, 2, 1], Direction.DOWN)
                scene.text(60, "当成型面板为方块模式时……").attachKeyFrame()
                scene.idle(80)
                let item1 = scene.world.createItemEntity(
                    [3.5, 5, 1.5],
                    [0, 0, 0],
                    "ae2:quartz_block")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.world.setBlocks([2, 1, 1], false, "ae2:quartz_block")
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [2, 1, 1], 60)
                scene.text(60, "成型面板会将方块放置在它的前面", [2.5, 1.5, 1.5])
                scene.idle(80)
                scene.world.hideSection([2, 1, 1], Direction.UP)
                scene.text(60, "当成型面板为掉落物模式时……").attachKeyFrame()
                scene.idle(80)
                item1 = scene.world.createItemEntity(
                    [3.5, 5, 1.5],
                    [0, 0, 0],
                    "ae2:quartz_block")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.world.createItemEntity(
                    [2.5, 1.5, 1.75],
                    [0, 0, 0],
                    "ae2:quartz_block"
                )
                scene.overlay.showOutline("green", {}, [2, 1, 1], 60)
                scene.text(60, "成型面板会将物品以掉落物形式丢弃在它的前面", [2.5, 1.5, 1.5])
                scene.idle(80)
                scene.text(60, "配置成型面板的过滤选项可使其只输出过滤内的物品").attachKeyFrame()
                scene.idle(80)
                scene.showControls(40, [2.5, 1.5, 1.75], "right")
                .withItem("ae2:certus_quartz_crystal")
                scene.idle(20)
                item1 = scene.world.createItemEntity(
                    [3.5, 5, 1.5],
                    [0, 0, 0],
                    "ae2:quartz_block")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.idle(40)
                item1 = scene.world.createItemEntity(
                    [3.5, 5, 1.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.world.createItemEntity(
                    [2.5, 1.5, 1.75],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal"
                )
            })
})