Ponder.registry(event => {
    event.create(["ae2:molecular_assembler"])
    .scene(
        "createdelight:molecular_assembler",
        "分子装配室的使用",
        "createdelight:ponder_molecular_assembler", 
        
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
            scene.showBasePlate()
            scene.idle(20)
            scene.world.showSection([0, 1, 0, 3, 1, 0], Direction.DOWN)
            scene.world.showSection([2, 1, 1, 2, 2, 2], Direction.DOWN)
            scene.world.showSection([1, 1, 1, 1, 1, 1], Direction.DOWN)
            scene.text(60, "要使用分子装配室……")
            scene.idle(80)
            scene.world.showSection([1, 1, 2, 1, 1, 2], Direction.DOWN)
            scene.text(60, "你需要将其与样板供应器放在一起", [1.5, 2, 2.5]).attachKeyFrame()
            scene.idle(80)
            scene.text(60, "分子装配室可以自动化工作台，切石机，锻造台的配方，且会把产物自动送回样板供应器")
            scene.idle(80)
            scene.text(60, "样板供应器和分子装配室都可以传递网络……").attachKeyFrame()
            scene.idle(80)
            scene.world.showSection([0, 1, 1, 1, 2, 2], Direction.DOWN)
            scene.text(60, "所以你可以搭建出类似这样的结构")
            scene.idle(80)

        }
    )
})