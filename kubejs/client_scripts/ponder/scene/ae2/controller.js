Ponder.registry(event => {
    event.create("ae2:controller")
        .scene(
            "createdelight:me_controller",
            "ME控制器的摆放方式……",
            "createdelight:ponder_me_controller",
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.world.showSection([0, 0, 0, 9, 0, 9], Direction.UP)
                scene.world.setBlocks([8, 1, 1], "ae2:controller", false)
                scene.idle(20)
                scene.world.showSection([0, 1, 1, 1, 1, 1], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "这是一个控制器……")
                scene.idle(60)
                scene.text(60, "控制器需要接入能源才能工作，使用其他mod的能源也可", [ 0.5, 1.5, 1.5]).attachKeyFrame()
                scene.overlay.showOutline("green", {}, [0, 1, 1], 60)
                scene.idle(80)
                for (let index = 0; index < 6; index++) {
                    scene.world.showSection([index + 2, 1, 1], Direction.WEST)
                    scene.world.showSection([1, 2 + index, 1], Direction.DOWN)
                    scene.world.showSection([1, 1, 2 + index], Direction.NORTH)
                    scene.idle(5)
                }
                scene.idle(10)
                scene.text(60, "控制器每个维度都可延伸最多七格").attachKeyFrame()
                scene.idle(60)
                scene.idle(30)
                scene.world.showSection([8, 1, 1], Direction.DOWN)
                scene.idle(20)
                scene.world.modifyBlocks([8, 1, 1, 1, 1, 1], state => state.with("state", "conflicted"), false)
                scene.world.modifyBlocks([1, 8, 1, 1, 1, 1], state => state.with("state", "conflicted"), false)
                scene.world.modifyBlocks([1, 1, 8, 1, 1, 1], state => state.with("state", "conflicted"), false)
                scene.world.modifyBlock([7, 1, 1], state => state.with("type", "column_x"), false)
                scene.text(60, "超过七格整个网络就会过载")
                scene.rotateCameraY(180)
                scene.idle(80)
                scene.world.showSection([3, 1, 3, 5, 1, 4], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "控制器之间不能传递频道（即不能连接）").attachKeyFrame()
                scene.overlay.showOutline("red", {}, [3, 1, 3, 5, 1, 4], 60)
                scene.idle(80)
                scene.world.showSection([3, 1, 5, 8, 3, 7], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "控制器也不能摆成十字的状态").attachKeyFrame()
                scene.idle(80)
            })
})