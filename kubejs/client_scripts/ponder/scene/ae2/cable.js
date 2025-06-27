Ponder.registry(event => {
    event.create([
        "ae2:fluix_glass_cable",
        "ae2:fluix_covered_cable",
        "ae2:fluix_covered_dense_cable",
        "ae2:fluix_smart_cable",
        "ae2:fluix_smart_dense_cable"])
        .scene(
            "createdelight:cable",
            "AE中的线缆",
            "createdelight:ponder_cable",
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([0, 1, 0, 4, 1, 1], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "这些是AE的线缆……").attachKeyFrame()
                scene.idle(80)
                scene.text(60, "所有同色的线缆都可以互相连接").attachKeyFrame()
                scene.idle(80)
                scene.world.showSection([0, 1, 2, 4, 1, 2], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "所有颜色的线缆都可以和福鲁伊克斯线缆相连接")
                scene.idle(80)
                scene.world.showSection([0, 1, 3, 4, 1, 3], Direction.DOWN)
                scene.text(60, "染色后不同颜色的线缆都不会连接").attachKeyFrame()
                scene.idle(60)
            }
        )
    event.create([
        "ae2:fluix_glass_cable",
        "ae2:fluix_covered_cable"])
        .scene(
            "createdelight:small_cable",
            "玻璃线缆与包层线缆",
            "createdelight:ponder_small_cable",
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([0, 1, 0], Direction.DOWN)
                scene.world.showSection([0, 1, 1, 4, 1, 1], Direction.DOWN)
                scene.world.showSection([4, 1, 1, 4, 1, 4], Direction.DOWN)
                scene.world.showSection([4, 1, 4, 0, 1, 4], Direction.DOWN)
                scene.text(60, "玻璃线缆与福鲁伊克斯线缆使用上仅有外观上的差距").attachKeyFrame()
                scene.idle(60)
                scene.world.showSection([0, 1, 2, 3, 1, 3], Direction.DOWN)
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [0, 1, 2, 3, 1, 3], 60)
                scene.text(60, "该线缆能够传递八个频道", [2, 2, 3]).attachKeyFrame()
                scene.idle(80)
                scene.world.showSection([3, 1, 0], Direction.DOWN)
                scene.idle(20)
                scene.overlay.showOutline("red", {}, [0, 1, 2, 3, 1, 3], 60)
                scene.overlay.showOutline("red", {}, [3, 1, 0], 60)
                scene.text(60, "当网络中拥有超过八个消耗频道的机器时网络便会过载")
            })
    event.create("ae2:fluix_covered_dense_cable")
        .scene(
            "createdelight:covered_dense_cable",
            "致密包层线缆",
            "createdelight:ponder_covered_dense_cable",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.world.showSection([0, 0, 0, 9, 0, 9], Direction.UP)
                scene.idle(20)
                scene.world.showSection([0, 1, 0, 9, 1, 9], Direction.DOWN)
                scene.idle(20)
                scene.rotateCameraY(180)
                scene.idle(60)
                scene.text(60, "致密线缆能够传递32个频道")
                scene.idle(80)
                scene.text(60, "但它并不能接入单格类机器（破坏/成型面板，输入/输出/存储总线，线缆内形式的机器）")
                scene.idle(60)
            }
        )
})