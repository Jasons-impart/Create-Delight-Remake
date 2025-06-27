Ponder.registry(e => {
    e.create("ae2:io_port")
        .scene(
            "createdelight:io_port",
            "使用IO端口整理存储",
            "createdelight:ponder_io_port",
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
                scene.world.showSection([0, 0, 0, 9, 0, 9], Direction.UP)
                scene.idle(20)
                scene.world.showSection([3, 1, 4, 5, 1, 4], Direction.DOWN)
                scene.idle(20)
                scene.overlay.showOutline("green", {}, [4, 1, 4], 60)
                scene.text(60, "ME IO端口能够将其中的存储元件内的东西导入到网络，或者将网络内的存储内容导入元件", [4.5, 2, 4.5]).attachKeyFrame()
                scene.idle(80)
                scene.world.showSection([0, 1, 0, 4, 1, 3], Direction.DOWN)
                scene.text(60, "你可以使用它将网络内的物品导出到存储元件")
                scene.idle(60)
                scene.world.hideSection([0, 1, 0, 4, 1, 3], Direction.UP)
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(20)
                scene.world.showSection([4, 1, 5, 6, 1, 8], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "使用ME IO端口来整理驱动器中存储元件的内容似乎也是一个不错的选择")
                scene.idle(60)

            })
        .scene(
            "createdelight:io_port_output",
            "使用IO端口输出大量物品",
            "createdelight:ponder_io_port_output",
        (builder, util) => {
            let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.world.showSection([1, 1, 4, 3, 1, 4], Direction.DOWN)
                scene.idle(20)
                scene.text(60, "IO端口的输入与输出速度非常的快……")
                scene.idle(80)
                scene.world.showSection([2, 1, 3, 2, 1, 2], Direction.DOWN)
                scene.text(60, "因此你可以使用它来生产物质球和奇点")
                scene.idle(20)
                scene.rotateCameraY(180)
                scene.idle(40)
            }
        )
})