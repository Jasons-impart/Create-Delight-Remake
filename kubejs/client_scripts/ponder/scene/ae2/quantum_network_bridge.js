Ponder.registry(e => {
    e.create(["ae2:quantum_ring", "ae2:quantum_link"])
        .scene(
            "createdelight:quantum_network_bridge",
            "使用量子网桥将网络传递到远端",
            "createdelight:ponder_quantum_network_bridge",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.world.showSection([0, 0, 0, 9, 0, 9], Direction.UP)
                scene.idle(20)
                scene.text(60, "量子网桥可用于网络的传输")
                scene.idle(80)
                scene.text(60, "为了搭建一个量子环结构，你需要八个量子环和一个量子链接仓").attachKeyFrame()
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        scene.world.modifyBlock([i, j + 1, 0], state => state.with("formed", "false"), false)
                        if (i != 1 || j != 1) {
                            scene.world.showSection([i, j + 1, 0], Direction.DOWN)
                            scene.idle(5)
                        }
                    }
                }
                scene.idle(10)
                scene.world.showSection([1, 2, 0], Direction.SOUTH)
                scene.idle(20)
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (!(i != 1 && j != 1))
                            scene.world.modifyBlock([i, j + 1, 0], state => state.with("formed", "true"), false)
                    }
                }
                scene.idle(30)
                scene.rotateCameraY(180)
                scene.idle(30)
                scene.world.showSection([0, 1, 1, 3, 1, 3], Direction.DOWN)
                scene.overlay.showOutline("green", {}, [1, 1, 0], 60)
                scene.overlay.showOutline("green", {}, [0, 2, 0], 60)
                scene.overlay.showOutline("green", {}, [1, 3, 0], 60)
                scene.overlay.showOutline("green", {}, [2, 2, 0], 60)
                scene.text(60, "连接量子环和网络只能通过围绕量子连接仓的四个量子环方块", [1.5, 2.5, 1]).attachKeyFrame()
                scene.idle(80)
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (i != 1 && j != 1)
                            scene.world.modifyBlock([i + 6, j + 1, 8], state => state.with("formed", "false"), false)
                        scene.world.showSection([i + 6, j + 1, 8], Direction.DOWN)
                        scene.idle(5)
                    }
                }
                scene.text(60, "量子环是成双成对使用的，你需要在你需要的远端也放置一个量子环结构").attachKeyFrame()
                scene.idle(80)
                scene.text(60, "使用量子环，你需要为两个量子环分别放入同时产生的量子缠绕态奇点")
                scene.showControls(40, [7.5, 2.5, 8.5], "left").withItem("ae2:quantum_entangled_singularity")
                scene.idle(40)
                scene.rotateCameraY(180)
                scene.idle(30)
                scene.showControls(40, [1.5, 2.5, 0], "left").withItem("ae2:quantum_entangled_singularity")
                scene.idle(60)
                scene.world.showSection([7, 1, 7, 4, 1, 5], Direction.DOWN)
                scene.idle(20)
                scene.world.showSection([3, 2, 2], Direction.DOWN)
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(30)
                let item1 = scene.world.createItemEntity(
                    [3.5, 5, 2.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(10)
                scene.world.modifyEntity(item1, (e) => {
                  e.kill()
                })
                scene.idle(20)
                scene.showControls(40, [5.5, 1.5, 6], "down").withItem("ae2:certus_quartz_crystal")
                scene.idle(60)
                scene.text(60, "一对量子环固定消耗400AE/t，且不随距离变化")
            })
})