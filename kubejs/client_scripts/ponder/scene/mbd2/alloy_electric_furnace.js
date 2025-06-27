Ponder.registry(event => {
    event.create([
        "createdelight:alloy_electric_furnace",
        "createdelightcore:copper_coil"
    ])
        .scene(
            "createdelight:alloy_electric_furnace",
            "合金电炉",
            "createdelight:ponder_alloy_electric_furnace",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                for (let i = 0; i < 5; i++) {
                    scene.world.showSection([3, i + 1, 2, 5, i + 1, 4], "down")
                    scene.idle(20)
                }
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(60, "在这个多方块结构中，锻造钢机壳可以被锻造钢输入/输出总线代替").attachKeyFrame()
                scene.idle(80)
                scene.text(60, "铜线圈可以最多两层，此时工作效率更高").attachKeyFrame()
                scene.idle(80)
                scene.world.showSection([0, 1, 0, 8, 2, 1], "down")
                scene.world.showSection([0, 1, 0, 2, 2, 2], "down")
                scene.world.showSection([6, 1, 0, 8, 4, 5], "down")
                scene.idle(30)
                scene.rotateCameraY(90)
                scene.idle(40)
            })
})