Ponder.registry(event => {
    event.create(["ae2:pattern_provider", "ae2:crafting_unit", "ae2:molecular_assembler"])
        .scene(
            "createdelight:ae_crafting_system",
            "AE的自动合成系统",
            "createdelight:ponder_ae_crafting_system",
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([2, 1, 1, 2, 1, 3], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "要搭建一个自动合成系统……")
                scene.idle(60)
                scene.world.showSection([0, 1, 1, 1, 1, 3], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "你需要一个CPU多方块", [0.5, 2, 2.5])
                scene.overlay.showOutline("green", {}, [0, 1, 1, 0, 1, 3], 40)
                scene.idle(60)
                scene.world.showSection([4, 1, 2, 3, 1, 0], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "还有样板供应器与输出对象", [4.5, 2, 1])
                scene.overlay.showOutline("green", {}, [4, 1, 0, 4, 1, 1], 40)
                
            })
})