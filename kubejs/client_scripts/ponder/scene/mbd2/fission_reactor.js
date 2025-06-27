Ponder.registry(event => {

    event.create([
        "createdelight:fission_fuel_assembly",
        "createdelight:fission_reactor"
    ])
        .scene(
            "createdelight:fission_reactor",
            "裂变反应堆",
            "createdelight:ponder_fission_reactor",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                let textList = [
                    [
                        "首先铺一层底层……",
                        "在这个多方块结构中的核反应堆外壳可以被锻造钢输入/输出总线、核反应堆玻璃代替"
                    ],
                    [
                        "然后按照这种方式放置裂变燃料组件，需要注意裂变燃料组件可以最多堆叠5层",
                        "这里的玻璃虽然不是必须，但是如果不放置核反应堆砖块或玻璃会导致辐射外露"
                    ],
                    ["下一层与第一层结构类似"],
                    ["然后是最上层"]
                ]
                let basePos = [5, 1, 0]
                for (let j = 0; j < 4; j++) {
                    for (let i = 0; i < 6; i++) {
                        scene.world.showSection([basePos[0] - i, basePos[1] + j, basePos[2] + i, basePos[0] + i, basePos[1] + j, basePos[2] + i], "down")
                        scene.world.showSection([basePos[0] - (6 - i), basePos[1] + j, basePos[2] + i + 6, basePos[0] + (6 - i), basePos[1] + j, basePos[2] + i + 6], "down")
                    }
                    textList[j].forEach(str => {
                        scene.text(60, str)
                        scene.idle(80)
                    })
                }scene.idle(20)
                scene.text(40, "输入原料，反应堆就会工作。如果输出物积累在反应堆，或者没有冷却剂输入时会导致反应堆空转，此时会增加反应堆的损坏度")
                scene.idle(40)
                scene.world.showSection([9, 1, 3, 9, 3, 3], "down")
                scene.idle(10)
                scene.world.showSection([7, 1, 1], "down")
                scene.idle(10)
                scene.world.showSection([3, 1, 1], "down")
                scene.idle(10)
                scene.world.showSection([1, 1, 3, 1, 3, 3], "down")
                scene.idle(10)
                scene.world.showSection([1, 1, 1, 2, 4, 2], "down")
                scene.idle(30)
                scene.text(40, "损坏度达到100时会发生爆炸！")
                scene.idle(60)
                scene.text(40, "不要在反应堆工作时破坏多方块中的任何方块！")
            })
})