Ponder.registry(event => {
    event.create(["ae2:interface", "ae2:cable_interface"])
        .scene(
            "createdelight:interface",
            "ME接口的使用",
            "createdelight:ponder_ae_interface", 
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([1, 1, 1, 1, 1, 3], Direction.DOWN)
                scene.world.showSection([1, 1, 2, 3, 1, 2], Direction.DOWN)
                scene.idle(20)
                // scene.rotateCameraY(90)
                scene.text(60, "ME接口是网络与外界的接口")
                scene.idle(60),
                scene.world.showSection([3, 2, 2], Direction.DOWN)
                scene.addKeyframe()
                scene.idle(20)
                let item1 = scene.world.createItemEntity(
                    [3.5, 5, 2.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(15)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.idle(10)
                scene.text(60, "可以将物料直接从ME接口输入进网络")
                scene.idle(70)
                scene.world.hideSection([3, 2, 2], Direction.UP)
                scene.idle(20)
                scene.text(40, "配置ME接口的槽位")
                scene.idle(40)
                scene.showControls(40, [3.5, 2, 2.5], "down")
                .withItem("ae2:certus_quartz_crystal")
                scene.idle(40)
                scene.world.showSection([3, 1, 1], Direction.SOUTH)
                scene.idle(20)
                scene.text(60, "它会将自身填充物料至你所设定的值")
                scene.world.flapFunnel([3, 1, 1], true)
                scene.world.createItemEntity(
                    [3.5, 1.25, 1.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(60)
                

            })
})