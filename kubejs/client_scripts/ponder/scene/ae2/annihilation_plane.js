const $CreateSceneBuilder = Java.loadClass("com.simibubi.create.foundation.ponder.CreateSceneBuilder")

Ponder.registry(event => {
    event.create("ae2:annihilation_plane")
    .scene(
        "createdelight:annihilation_plane",
        "破坏面板的使用",
        "createdelight:ponder_annihilation_plane", 
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
            scene.showBasePlate()
            scene.idle(20)
            scene.world.showSection([2, 1, 1, 3, 1, 2], Direction.DOWN)
            scene.world.showSection([2, 2, 2], Direction.DOWN)
            scene.idle(20)
            scene.text(60, "破坏面板会将其前面的方块或者掉落物收集到网络中（如果能的话）")
            scene.idle(60)
            scene.world.setBlocks([2, 2, 1], false, "ae2:quartz_cluster")
            scene.world.showSection([2, 2, 1], Direction.UP)
            scene.idle(20)
            scene.world.showSection([1, 1, 2, 0, 1, 2], Direction.DOWN)
            scene.idle(20)
            scene.world.destroyBlock([2, 2, 1])
            scene.idle(20)
            scene.showControls(40, [0.5, 2, 2.5], "down")
            .withItem("ae2:certus_quartz_crystal")
            scene.idle(60)
            let item1 = scene.world.createItemEntity(
                [2.5, 5, 2.5],
                [0, 0, 0],
                "ae2:certus_quartz_crystal")
            scene.idle(10)
            scene.world.modifyEntity(item1, (e) => {
              e.kill()
            })
            scene.idle(20)
            scene.showControls(40, [0.5, 2, 2.5], "down")
            .withItem("ae2:certus_quartz_crystal")
            scene.idle(60)
            
        })
        .scene(
            "createdelight:annihilation_plane_filter",
            "使破坏面板破坏/收集特定的物品",
            "createdelight:ponder_annihilation_plane_filter", 
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.world.showSection([0, 1, 0, 3, 1, 2], Direction.DOWN)
                scene.world.showSection([2, 2, 2], Direction.DOWN)
                scene.idle(40)
                scene.world.setBlocks([2, 2, 1], false, "ae2:small_quartz_bud")
                scene.world.showSection([2, 2, 1], Direction.UP)
                scene.idle(20)
                scene.world.destroyBlock([2, 2, 1])
                scene.idle(40)
                scene.overlay.showOutline("red", {}, [2, 2, 1], 60)
                scene.text(60, "你会发现破坏面板会收集它前方的所有物品……", [2.5, 2.5, 1.5]).attachKeyFrame()
                scene.idle(80)
                scene.text(60, "对此，你可以控制你的网络，使其只能容纳某些物品")
                scene.idle(80)
                scene.world.hideSection([1, 1, 2, 0, 1, 2], Direction.UP)
                scene.idle(20)
                scene.world.showSection([4, 1, 2, 5, 1, 2], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "配置存储总线的过滤……", [4.75, 1.5, 2.5]).attachKeyFrame()
                scene.overlay.showOutline("green", {}, [4, 1, 2], 60)
                scene.idle(80)
                scene.showControls(40, [4.75, 1.5, 2.5], "down")
                .withItem("ae2:certus_quartz_crystal")
                scene.idle(40)
                let quartz_list =
                    [
                        "ae2:small_quartz_bud",
                        "ae2:medium_quartz_bud",
                        "ae2:large_quartz_bud",
                        "ae2:quartz_cluster"
                    ]
                quartz_list.forEach(block => {
                    scene.world.setBlocks([2, 2, 1], block, false)
                    scene.idle(20)
                })
                scene.world.destroyBlock([2, 2, 1])
                scene.showControls(40, [5.5, 2, 2.5], "down")
                .withItem("ae2:certus_quartz_crystal")
                scene.idle(60)
                scene.text(60, "需要注意的是，没有掉落物的方块无论怎样都会被破坏面板破坏")
                scene.idle(80)
                scene.text(60, "为破坏面板附魔精准采集可能可以为解决该问题提供思路")
                scene.idle(60)

            })
})