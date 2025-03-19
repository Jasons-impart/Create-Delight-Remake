Ponder.registry(event => {
    event.create(["ae2:pattern_provider", "ae2:cable_pattern_provider"])
        .scene(
            "createdelight:pattern_provider",
            "样板供应器的使用",
            "createdelight:ponder_pattern_provider",
            (scene, util) => {
                scene.world.showSection([0, 0, 0, 7, 0, 7], Direction.UP)
                scene.showBasePlate()
                scene.idle(10)
                scene.world.showSection([4, 1, 0, 4, 1, 2], Direction.UP)
                scene.idle(10)
                scene.world.showSection([1, 1, 3, 4, 1, 3], Direction.UP)
                scene.idle(20)
                scene.world.showSection([2, 2, 3], Direction.UP)
                scene.idle(10)
                scene.world.showSection([4, 2, 1, 4, 3, 3], Direction.UP)
                scene.idle(20)
                scene.text(40, "这是一个样板供应器", [2.5, 2.5, 3.5]).attachKeyFrame()
                scene.idle(60)
                scene.showControls(20, [2.5, 3, 3.5], "down")
                    .rightClick()
                    .withWrench()
                scene.idle(20)
                scene.world.modifyBlock([2, 2, 3], state => state.with("push_direction", "down"), false)
                scene.idle(20)
                scene.text(40, "使用扳手点击样板供应器可使其方向变为扳手点击的方向", [2.5, 3, 3.5]).attachKeyFrame()
                scene.idle(60)
                scene.text(40, "当网络下达合成请求时……").attachKeyFrame()
                scene.idle(20)

                let iron_ingot = scene.world.createItemOnBelt(
                    [2, 1, 3],
                    Direction.down,
                    "minecraft:iron_ingot"
                )
                scene.idle(30)
                scene.world.removeItemsFromBelt([4, 1, 3])
                let iron_sheet = scene.world.createItemOnBelt(
                    [4, 1, 3],
                    Direction.down,
                    "create:iron_sheet"
                )
                scene.idle(20)
                scene.world.removeItemsFromBelt([4, 1, 3])
                scene.world.createItemEntity(
                    [5, 2, 3.5],
                    [0.2, 0.25, 0],
                    "create:iron_sheet")
                scene.idle(20)
                scene.text(40, "样板供应器会将原料输出到临近的容器内", [2.5, 1.5, 3.5])
                scene.overlay.showOutline("green", {}, [2, 1, 3], 40)
                scene.idle(80)
                scene.addKeyframe()
                scene.text(40, "完成一次合成需要将物品返回网络", [2.5, 2.5, 3.5])
                scene.idle(60)
                scene.world.showSection([5, 1, 3, 5, 1, 6], Direction.DOWN)
                scene.world.showSection([6, 1, 4, 0, 1, 7], Direction.DOWN)
                scene.world.showSection([2, 2, 4], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "因此你需要搭建一个回流装置")

            }
        )
    event.create(["ae2:pattern_provider", "ae2:cable_pattern_provider", "ae2:interface", "ae2:cable_interface"])
        .scene(
            "createdelight:pattern_provider_interaction",
            "样板供应器与ME接口的联动",
            "createdelight:ponder_pattern_provider_interaction",
            (scene, util) => {
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([1, 1, 0, 4, 1, 1], Direction.DOWN)
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [1, 1, 1, 2, 1, 1], 40)
                scene.text(40, "当样板供应器与ME接口接触时……", [2, 1.5, 1.5])
                scene.idle(60)
                scene.showControls(40, [1.5, 1.5, 1.5], "down")
                    .withItem("ae2:certus_quartz_crystal")
                scene.idle(40)
                scene.world.createItemEntity(
                    [4.5, 1.5, 1.5],
                    [0, 0, 0],
                    "ae2:certus_quartz_crystal")
                scene.idle(20)
                scene.text(40, "样板供应器会直接将原料输入到ME接口所在的网络")
            }
        )
})