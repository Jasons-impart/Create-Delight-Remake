Ponder.registry(event => {
    event.create(["ae2:storage_bus"])
        .scene("createdelight:storage_bus",
            "存储总线的使用",
            "createdelight:ponder_storage_bus",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([1, 1, 1, 1, 1, 3], Direction.DOWN)
                scene.text(60, "存储总线可以将外界的存储并入到AE网络中")
                scene.idle(80)
                scene.world.showSection([2, 1, 2, 4, 1, 2], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([4, 1, 3, 4, 2, 3], Direction.DOWN)
                scene.addKeyframe()
                scene.idle(10)
                scene.rotateCameraY(-180)
                scene.idle(40)
                let item1 = scene.world.createItemEntity(
                    [4.5, 5, 3.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                    e.kill()
                })
                scene.idle(40)
                scene.showControls(40, [2, 1.5, 2.75], "right")
                    .withItem("ae2:certus_quartz_crystal")

            })
    event.create(["ae2:storage_bus", "ae2:interface", "ae2:cable_interface"])
        .scene("createdelight:storage_bus_interface_interaction",
            "存储总线与ME接口的互动",
            "createdelight:ponder_storage_bus_interface_interaction",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([1, 1, 1, 1, 1, 3], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([5, 1, 1, 5, 1, 4], Direction.DOWN)
                scene.text(60, "当你想要让一个网络能访问另一个的内容……").attachKeyFrame()
                scene.idle(60)
                scene.rotateCameraY(90)
                scene.idle(30)
                scene.world.showSection([2, 1, 2, 3, 1, 2], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([4, 1, 2], Direction.DOWN)
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [3, 1, 2, 4, 1, 2], 60)
                scene.text(60, "将存储总线与ME接口相贴", [4, 1.5, 2.5]).attachKeyFrame()
                scene.idle(60)
                scene.overlay.showOutline("green", {}, [3, 1, 2], 60)
                scene.text(60, "存储总线的一端的网络……", [3.5, 1.5, 2.5])
                scene.idle(80)
                scene.overlay.showOutline("green", {}, [4, 1, 2], 60)
                scene.text(60, "能够访问ME接口那一段的网络", [4.5, 1.5, 2.5])
                scene.idle(80)
                scene.text(60, "反之则不可")
                scene.idle(60)
                scene.addKeyframe()
                scene.rotateCameraY(90)
                scene.idle(30)
                scene.world.showSection([5, 2, 4], Direction.DOWN)
                scene.idle(20)
                let item1 = scene.world.createItemEntity(
                    [5.5, 5, 4.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.idle(20)
                scene.showControls(60, [2.5, 1.5, 2.75], "down")
                .withItem("ae2:certus_quartz_crystal")
            })
})