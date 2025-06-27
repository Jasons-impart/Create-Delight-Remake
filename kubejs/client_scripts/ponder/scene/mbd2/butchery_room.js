Ponder.registry(event => {
    event.create("createdelight:butchery_room")
        .scene(
            "createdelight:butchery_room",
            "屠宰室",
            "createdelight:ponder_butchery_room",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                for (let i = 0; i < 4; i++) {
                    scene.world.showSection([1, i + 1, 0, 5, i + 1, 4], "down")
                    scene.idle(20)
                }
                scene.idle(40)
                scene.text(60, "在这个多方块结构中，安山机壳可以被安山输入/输出总线、安山（通透）玻璃机壳，应力输入总线代替").attachKeyFrame()
                scene.world.setBlocks([4, 3, 0, 2, 2, 0], true, "crystal_clear:andesite_clear_glass_casing")
                scene.idle(10)
                scene.world.setBlocks([5, 3, 1, 5, 3, 2], true, "crystal_clear:andesite_clear_glass_casing")
                scene.idle(10)
                scene.world.setBlocks([1, 3, 1, 1, 3, 2], true, "crystal_clear:andesite_clear_glass_casing")
                scene.idle(60)
            })
})