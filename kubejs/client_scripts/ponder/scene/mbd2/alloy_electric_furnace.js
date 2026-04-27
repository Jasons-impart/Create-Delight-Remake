const $BlockStateProperties = Java.loadClass('net.minecraft.world.level.block.state.properties.BlockStateProperties')

Ponder.registry(e => {
    e.create([
        "createdelight:alloy_electric_furnace",
        "createdelight:copper_coil"
    ])
        .scene(
            "createdelight:alloy_electric_furnace",
            "合金电炉的搭建",
            "createdelight:ponder_alloy_electric_furnace",
            
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.scaleSceneView(0.8)
                scene.idle(20)
                scene.text(40, "先让我们快速的搭建一下基础结构").attachKeyFrame()
                scene.idle(40)
                for (let i = 0; i < 8; i++) {
                    scene.world.showSection([2, i + 1, 2, 6, i + 1, 6], Direction.DOWN)
                    scene.idle(10)
                }
                scene.text(40, "OK,搭建完毕!").attachKeyFrame()
                scene.idle(40)
                scene.text(80, "现在让我们看看全貌")
                scene.rotateCameraY(90)
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(40, "在这个多方块结构中, 任意的锻造钢机壳都可以被锻造钢输入/输出总线代替", [2, 2.5, 4.5]).attachKeyFrame()
                scene.world.replaceBlocks([2, 2, 3], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.world.replaceBlocks([2, 2, 4], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.world.replaceBlocks([2, 2, 5], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.idle(40)
                scene.rotateCameraY(90)
                scene.text(40, "在这个多方块结构中, 任意的锻造钢机壳都可以被锻造钢输入/输出总线代替", [7, 2.5, 4.5])
                scene.world.replaceBlocks([6, 2, 3], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.world.replaceBlocks([6, 2, 4], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.world.replaceBlocks([6, 2, 5], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.idle(40)
                scene.text(40, "合金电炉基础并行数为8").attachKeyFrame()
                scene.text(40, "其中线圈层可以叠加, 最多两层, 此时运行速度*2, 配方并行*4", [4.5, 5.5, 4.5])
                scene.idle(20)
                let top = scene.world.makeSectionIndependent([2, 5, 2, 6, 8, 6])
                scene.world.moveSection(top, [0, 1, 0], 15)
                scene.idle(20)
                scene.world.showSection([3, 5, 3, 5, 5, 5], Direction.WEST)
                scene.idle(20)
                scene.rotateCameraY(-90)
                scene.markAsFinished()
            })
        .scene(
            "createdelight:using_alloy_electric_furnace",
            "合金电炉的使用",
            "createdelight:ponder_alloy_electric_furnace_use",
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
                scene.showBasePlate()
                scene.idle(20)
                scene.text(40, "现在让我们来学习一下如何使用合金电炉").attachKeyFrame()
                scene.idle(40)
                scene.scaleSceneView(0.8)
                scene.world.showSection([2, 1, 2, 6, 9, 6], Direction.DOWN)
                scene.idle(20)
                scene.text(40, "首先你需要几个输入/输出总线...", [2, 2.5, 4.5]).attachKeyFrame()
                scene.world.replaceBlocks([2, 2, 4], Block.id("createdelight:forged_steel_export_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.WEST), true)
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(20)
                scene.world.replaceBlocks([6, 2, 3], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.world.replaceBlocks([6, 2, 4], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.world.replaceBlocks([6, 2, 5], Block.id("createdelight:forged_steel_import_bus").blockState.trySetValue($BlockStateProperties.FACING, Direction.EAST), true)
                scene.idle(20)
                scene.rotateCameraY(-90)
                scene.idle(20)
                scene.text(40, "然后将输入/输出总线接入你的工厂").attachKeyFrame()
                scene.world.showSection([1, 2, 4], Direction.EAST)
                scene.idle(20)
                scene.rotateCameraY(90)
                scene.idle(20)
                scene.world.showSection([7, 1, 3, 9, 3, 5], Direction.WEST)
                scene.idle(20)
                scene.text(40, "§4别忘了供电")
                scene.overlay.showOutline("red", {}, [7, 2, 4, 9, 3, 4], 20)
                scene.idle(45)
                scene.text(40, "输入所需的材料(这里用钢做示范)").attachKeyFrame()
                scene.idle(45)
                scene.showControls(40, [8.5, 1.5, 3.6], "up").withItem("minecraft:iron_ingot")
                scene.showControls(40, [8.5, 1.5, 5.4], "up").withItem("createmetallurgy:coke")
                scene.text(40, "输入铁和焦炭")
                let iron_ingot = scene.world.createItemEntity(
                    [8.5, 4, 3.5],
                    [0, 0, 0],
                    "3x minecraft:iron_ingot"
                )
                let coke = scene.world.createItemEntity(
                    [8.5, 4, 5.5],
                    [0, 0, 0],
                    "createmetallurgy:coke"
                )
                scene.idle(10)
                PonderUtil.removeEntity(scene, iron_ingot)
                PonderUtil.removeEntity(scene, coke)
                PonderUtil.createItemOnBelt(scene, [8, 1, 3], Direction.UP, Item.of("3x minecraft:iron_ingot"))
                PonderUtil.createItemOnBelt(scene, [8, 1, 5], Direction.UP, Item.of("createmetallurgy:coke"))
                scene.idle(20)
                PonderUtil.flapFunnel(scene, [7, 2, 3], false)
                PonderUtil.flapFunnel(scene, [7, 2, 5], false)
                PonderUtil.removeItemsFromBelt(scene, [7, 1, 3])
                PonderUtil.removeItemsFromBelt(scene, [7, 1, 5])
                scene.idle(40)
                scene.rotateCameraY(-90)
                scene.idle(40)
                scene.text(40, "等待一段时间后, 产出钢").attachKeyFrame()
                scene.idle(20)
                PonderUtil.flapFunnel(scene, [1, 2, 4], true)
                scene.world.createItemEntity(
                    [1.5, 2.3, 4.5],
                    [0, 0, 0],
                    "3x createmetallurgy:steel_ingot"
                )
                scene.showControls(40, [1.5, 2.5, 4.6], "down").withItem('createmetallurgy:steel_ingot')
                scene.idle(20)
                scene.markAsFinished()
            }
        )
})