Ponder.registry(event => {
    event.create(["ae2:pattern_provider", "ae2:cable_pattern_provider"])
        .scene(
            "createdelight:pattern_provider",
            "样板供应器的使用",
            "createdelight:ponder_pattern_provider",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
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
                    .withItem("create:wrench")
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
        .scene(
            "createdelight:ae_crafting_parallel",
            "自动合成的并行",
            "createdelight:ponder_ae_crafting_parallel",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.world.showSection([1, 0, 0, 8, 0, 8], Direction.UP)
                scene.idle(20)
                scene.world.showSection([1, 1, 0, 1, 1, 3], Direction.DOWN)
                scene.idle(10)
                for (let index = 0; index < 4; index++) {
                    scene.world.showSection([0, index, 4], Direction.DOWN)
                    scene.idle(5)
                }
                scene.world.showSection([1, 1, 4, 1, 1, 5], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([1, 3, 4], Direction.DOWN)
                scene.idle(40)
                scene.text(60, "使用多个样板供应器可以做到多个机器的并行").attachKeyFrame()
                scene.idle(80)
                scene.text(60, "内存卡可以复制机器的配置以及将其中配置应用于机器，当然样板供应器也不例外")
                scene.idle(80)
                scene.text(60, "使用内存卡shift右击样板供应器……").attachKeyFrame()
                scene.idle(20)
                scene.showControls(40, [1.5, 2, 3.5], "down")
                .whileSneaking()
                .withItem("ae2:memory_card")
                scene.idle(60)
                scene.text(60, "样板供应器会将其中样板的信息也存入内存卡中")
                scene.idle(60)
                scene.world.showSection([2, 1, 3, 2, 1, 5], Direction.DOWN)
                scene.idle(20)
                scene.world.showSection([2, 3, 4], Direction.DOWN)
                scene.text(60, "然后再使用内存卡右击目标的样板供应器……").attachKeyFrame()
                scene.idle(40)
                scene.showControls(40, [2.5, 2, 3.5], "down")
                .withItem("ae2:memory_card")
                scene.idle(20)
                scene.world.modifyBlock([2, 1, 3], bs => bs.with("push_direction", "south"), false)
                scene.idle(40)
                scene.text(40, "内存卡会消耗物品栏中的空白样板，并依照其记录的样板复制到目标样板供应器中").attachKeyFrame()
                scene.idle(60)
                scene.text(80, "然后以此类推，建造并行")
                scene.idle(20)
                for (let index = 1; index <= 5; index++) {
                    scene.world.showSection([2 + index, 1, 3, 2 + index, 1, 5], Direction.DOWN)
                    scene.world.showSection([2 + index, 3, 4], Direction.DOWN)
                    scene.idle(5)
                }
                scene.idle(10)
                scene.world.showSection([2, 1, 0, 7, 1, 1], Direction.DOWN)
                scene.idle(10)
                scene.world.showSection([1, 1, 6, 8, 1, 6], Direction.DOWN)
                scene.world.showSection([8, 1, 0, 8, 1, 6], Direction.DOWN)
                scene.idle(10)
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.world.showSection([1, 2, 5, 7, 2, 6], Direction.DOWN)
            }
        )
    event.create(["ae2:pattern_provider", "ae2:cable_pattern_provider", "ae2:interface", "ae2:cable_interface"])
        .scene(
            "createdelight:pattern_provider_interaction",
            "样板供应器与ME接口的联动",
            "createdelight:ponder_pattern_provider_interaction",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
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