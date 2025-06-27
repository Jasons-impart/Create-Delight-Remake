Ponder.registry(event => {
    event.create(["ae2:flawless_budding_quartz", "ae2:flawed_budding_quartz", "ae2:chipped_budding_quartz", "ae2:damaged_budding_quartz", "ae2:certus_quartz_crystal"])
        .scene(
            "createdelight:ae_budding_quartz_obtain",
            "赛特斯石英母岩的生成",
            (builder, util) => {
                
                let scene = new $CreateSceneBuilder(builder)
                scene.configureBasePlate(0, 0, 5)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.setBlocks([2, 1, 2], "ae2:flawless_budding_quartz")
                scene.world.showSection([2, 1, 2], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "这是一个赛特斯石英母岩", [2.5, 1.5, 2.5])
                scene.idle(60)
                let block_list =
                    [
                        ["ae2:damaged_budding_quartz", [1, 1, 1]],
                        ["ae2:flawed_budding_quartz", [1, 1, 2]],
                        ["ae2:quartz_block", [1, 1, 3]],
                        ["ae2:quartz_block", [2, 1, 1]],
                        ["ae2:chipped_budding_quartz", [2, 1, 3]],
                        ["ae2:flawed_budding_quartz", [3, 1, 1]],
                        ["ae2:damaged_budding_quartz", [3, 1, 2]],
                        ["ae2:chipped_budding_quartz", [3, 1, 3]],
                        ["ae2:mysterious_cube", [2, 2, 2]]
                    ]
                block_list.forEach(list => {
                    scene.world.setBlocks(list[1], list[0])
                    scene.world.showSection(list[1], Direction.DOWN)
                    scene.idle(5)
                })
                scene.text(60, "母岩会和神秘方块一起出现在陨石中").attachKeyFrame()
                scene.idle(60)

                block_list.forEach(list => {
                    scene.world.hideSection(list[1], Direction.UP)
                    scene.idle(5)
                })
            })
        .scene(
            "createdelight:ae_budding_quartz_grow",
            "赛特斯石英母岩的生长",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.configureBasePlate(0, 0, 5)
                scene.showBasePlate()
                scene.world.setBlocks([2, 1, 2], "ae2:flawed_budding_quartz")
                scene.world.showSection([2, 1, 2], Direction.DOWN)
                scene.idle(10)
                scene.text(100, "赛特斯石英母岩会随着时间生长")
                scene.idle(20)

                let quartz_list =
                    [
                        "ae2:small_quartz_bud",
                        "ae2:medium_quartz_bud",
                        "ae2:large_quartz_bud",
                        "ae2:quartz_cluster"
                    ]
                let budding_quartz_list = [
                    "ae2:flawless_budding_quartz",
                    "ae2:flawed_budding_quartz",
                    "ae2:chipped_budding_quartz",
                    "ae2:damaged_budding_quartz",
                    "ae2:quartz_block"
                ]
                scene.world.showSection([2, 2, 2], Direction.UP)
                quartz_list.forEach(block => {
                    scene.world.setBlocks([2, 2, 2], block, false)
                    scene.idle(20)
                })
                scene.text(100, "在生长过程中，赛特斯石英母岩有概率降低一个等级（除了无瑕母岩）").attachKeyFrame()
                scene.world.showSection([2, 1, 1], Direction.NORTH)
                for (let index = 1; index < budding_quartz_list.length; index++) {
                    scene.world.setBlocks([2, 1, 1], quartz_list[index - 1], false)
                    scene.world.modifyBlock([2, 1, 1], state => state.with("facing", "north"), false)
                    scene.world.setBlocks([2, 1, 2], budding_quartz_list[index], false)
                    scene.idle(20)
                }
                scene.idle(20)
                scene.addKeyframe()
                let pos_list = [
                    [1, 0, 0],
                    [-1, 0, 0],
                    [0, 0, 1]
                ]
                scene.world.setBlocks([2, 1, 2], "ae2:flawless_budding_quartz")
                pos_list.forEach(pos => {
                    scene.world.setBlocks([2 + pos[0], 1 + pos[1], 2 + pos[2]], "ae2:growth_accelerator", false)
                    scene.world.setBlocks([2 + pos[0], 2 + pos[1], 2 + pos[2]], "ae2:crystal_resonance_generator", false)
                    scene.world.modifyBlock([2 + pos[0], 1 + pos[1], 2 + pos[2]], state => state.with("facing", "up"), false)
                    scene.world.modifyBlock([2 + pos[0], 2 + pos[1], 2 + pos[2]], state => state.with("facing", "up"), false)
                    scene.world.showSection([2 + pos[0], 1 + pos[1], 2 + pos[2]], Direction.DOWN)
                    scene.world.showSection([2 + pos[0], 2 + pos[1], 2 + pos[2]], Direction.DOWN)

                })
                scene.text(60, "放置催生器可加速母岩生长（催生器可叠加）")
                scene.idle(20)
                
            }
        )
        .scene(
            "createdelight:ae_budding_quartz_repair",
            "赛特斯石英母岩的修复",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.configureBasePlate(0, 0, 5)
                scene.showBasePlate()
                scene.world.setBlocks([2, 1, 2], "ae2:quartz_block")
                scene.world.showSection([2, 1, 2], Direction.DOWN)
                scene.idle(10)
                scene.text(100, "母岩退化到石英块了？")
                scene.idle(20)
                let budding_quartz_list = [
                    "ae2:flawless_budding_quartz",
                    "ae2:flawed_budding_quartz",
                    "ae2:chipped_budding_quartz",
                    "ae2:damaged_budding_quartz",
                    "ae2:quartz_block"
                ]
                scene.addKeyframe()
                scene.idle(20)
                scene.showControls(20, [2.5, 1.5, 2.5], "down")
                .rightClick()
                .withItem("ae2:quartz_block")
                scene.idle(20)
                scene.world.setBlocks([2.5, 1.5, 2.5], "ae2:damaged_budding_quartz")
                scene.idle(60)
                scene.text(60, "手持与放置的相同等级的母岩右键右击它就有50%的概率生成一个更高级的母岩！")
                for (let index = budding_quartz_list.length - 2; index > 1; index--) {
                    const budding_quartz = budding_quartz_list[index];
                    scene.showControls(20, [2.5, 1.5, 2.5], "down")
                    .rightClick()
                    .withItem(budding_quartz_list[index])
                    scene.world.setBlocks([2, 1, 2], budding_quartz_list[index - 1])
                    scene.idle(20)
                }
                scene.idle(60)
                scene.text(60, "使用该方法修复可以获取无瑕母岩！")
                scene.showControls(20, [2.5, 1.5, 2.5], "down")
                .rightClick()
                .withItem("ae2:flawed_budding_quartz")
                scene.world.setBlocks([2, 1, 2], "ae2:flawless_budding_quartz")
                scene.idle(20)
            }
        )
})