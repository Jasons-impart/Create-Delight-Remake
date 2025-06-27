Ponder.registry(event => {
    event.create([
        "createdelight:hydropower_station",
        "createdelight:hydropower_station_fan",
        "createdelight:hydropower_amplifier"
    ])
        .scene(
            "createdelight:hydropower_station",
            "大型离心机",
            "createdelight:ponder_hydropower_station",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.world.showSection([0, 1, 0, 2, 19, 18], "down")
                scene.idle(20)
                scene.text(60, "大坝是提供应力的多方块结构……（结构过大所以只截取一部分）")
                scene.idle(80)
                scene.text(60, "最上方为水或者灵质时能够提供65536的应力量")
                scene.idle(80)
                scene.text(60, "大坝控制器上方的砖块可以被替换为大坝增幅器……")
                scene.idle(80)
                scene.text(60, "每增加一个都将增加大坝65536的应力输出")
                for (let i = 2; i <= 20; i++) {
                    scene.world.setBlock([1, i, 0], "createdelight:hydropower_amplifier", true)
                    scene.idle(5)
                }
            })
})