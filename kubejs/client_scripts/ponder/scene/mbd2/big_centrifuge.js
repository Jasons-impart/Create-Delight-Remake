Ponder.registry(event => {
    event.create([
        "createdelight:big_centrifuge",
        "createdelight:centrifuge_rotor"
    ])
        .scene(
            "createdelight:big_centrifuge",
            "大型离心机",
            "createdelight:ponder_big_centrifuge",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                for (let i = 0; i < 4; i++) {
                    scene.world.showSection([1, i + 1, 0, 5, i + 1, 4], "down")
                    scene.idle(20)
                }
                scene.idle(40)
                scene.text(60, "在这个多方块结构中，钢制机壳可以被钢输入/输出总线、钢（通透）玻璃机壳代替").attachKeyFrame()
                scene.world.setBlocks([4, 2, 0, 2, 2, 0], true, "createdelightcore:steel_glass_casing")
                scene.idle(10)
                scene.world.setBlocks([5, 2, 2, 5, 2, 3], true, "createdelightcore:steel_glass_casing")
                scene.idle(10)
                scene.world.setBlocks([1, 2, 2, 1, 2, 3], true, "createdelightcore:steel_glass_casing")
                scene.idle(60)
                scene.overlay.showOutline("green", {}, [3, 3, 2], 60)
                scene.text(60, "离心机多方块的上下必须是应力输入总线", [3.5, 4, 2.5])
                scene.idle(80)
                scene.overlay.showOutline("green", {}, [3, 4, 2], 60)
                scene.text(60, "输入的转速越快，机器的处理速度越快", [3.5, 5, 2.5])
            })
})