Ponder.registry(event => {
    event.create(["ae2:import_bus", "ae2:export_bus"])
        .scene("createdelight:import_export_bus",
            "输入总线与输出总线的使用",
            "createdelight:ponder_import_export_bus",
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([4, 1, 3], Direction.DOWN)
                scene.world.showSection([4, 1, 4, 2, 1, 4], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "输入总线和输出总线可对网络进行直接的存入和取出")
                scene.idle(80)
                scene.world.showSection([2, 1, 2, 1, 1, 2], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([1, 1, 3, 1, 1, 4], Direction.DOWN)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(60, "输出总线可将网络中的物品输入到目标容器中", [1.5, 1.5, 3.5]).attachKeyFrame()
                scene.overlay.showOutline("green", {}, [1, 1, 3], 60)
                scene.idle(80)
                scene.text(60, "设置输出总线的过滤……")
                scene.idle(60)
                scene.showControls(40, [1.5, 1.5, 3.25], "down").withItem("ae2:certus_quartz_crystal")
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.idle(30)
                scene.world.showSection([4, 2, 3], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([1, 1, 1], Direction.NORTH)
                scene.idle(30)
                let item1 = scene.world.createItemEntity(
                    [4.5, 5, 3.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(10)
                scene.world.modifyEntity(item1, (e) => {
                    e.kill()
                })
                scene.idle(10)
                scene.world.flapFunnel([1, 1, 1], true)
                item1 = scene.world.createItemEntity(
                    [1.5, 1.25, 1.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(80)
                scene.world.hideSection([1, 1, 1], Direction.UP)
                scene.world.hideSection([4, 2, 3], Direction.UP)
                scene.idle(40)
                scene.world.showSection([2, 1, 3], Direction.DOWN)
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.text(60, "输入总线可将容器中的物品输入网络", [2.5, 1.5, 3.5]).attachKeyFrame()
                scene.overlay.showOutline("green", {}, [2, 1, 3], 60)
                scene.idle(80)
                scene.text(60, "设置输入总线的过滤……")
                scene.idle(60)
                scene.showControls(40, [2.5, 1.5, 3.25], "down").withItem("ae2:certus_quartz_crystal")
                scene.idle(40)
                scene.world.showSection([4, 1, 2], Direction.NORTH)
                scene.idle(10)
                scene.world.showSection([2, 2, 2], Direction.DOWN)
                scene.rotateCameraY(90)
                scene.idle(40)
                item1 = scene.world.createItemEntity(
                    [2.5, 5, 2.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(10)
                scene.world.modifyEntity(item1, (e) => {
                    e.kill()
                })
                scene.idle(10)
                scene.world.flapFunnel([4, 1, 2], true)
                item1 = scene.world.createItemEntity(
                    [4.5, 1.25, 2.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(20)
            })
        .scene("createdelight:bus_transport",
            "使用输入/输出总线配合存储总线进行物流",
            "createdelight:ponder_bus_transport",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([0, 1, 0, 3, 1, 4], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "使用输入/输出总线配合存储总线可制作简易的物流")
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(60)
                scene.world.showSection([4, 1, 0, 4, 1, 3], Direction.DOWN)
                scene.world.showSection([1, 2, 0, 1, 2, 3], Direction.DOWN)
                scene.idle(20)
                let item1 = scene.world.createItemEntity(
                    [1.5, 5, 0.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(10)
                scene.world.modifyEntity(item1, (e) => {
                    e.kill()
                })
                scene.idle(10)
                scene.world.flapFunnel([4, 1, 0], true)
                item1 = scene.world.createItemEntity(
                    [4.5, 1.25, 0.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(20)
                item1 = scene.world.createItemEntity(
                    [1.5, 5, 3.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(10)
                scene.world.modifyEntity(item1, (e) => {
                    e.kill()
                })
                scene.idle(10)
                scene.world.flapFunnel([4, 1, 3], true)
                item1 = scene.world.createItemEntity(
                    [4.5, 1.25, 3.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(20)
            }
        )
})