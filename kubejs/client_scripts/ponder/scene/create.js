// todo: 做汉化键
Ponder.registry((event) => {
  // 序列装配
  event
    .create("create:precision_mechanism")
    .scene(
      "createdelight:sequenced_assembly",
      "序列装配",
      "createdelight:ponder_sequenced_assembly",
      
            (builder, util) => {
                let scene = new $CreateSceneBuilder(builder)
        scene.showBasePlate();

        // 设置转速(不设置默认256)
        PonderUtil.setKineticSpeed(scene, util.select.everywhere(), 64);
        PonderUtil.setKineticSpeed(scene, [1, 0, 0], -64);

        // 开始bb
        scene.idle(20);
        scene.world.showSection([1, 1, 0, 4, 1, 1], Direction.up);
        scene.world.showSection([4, 1, 2, 4, 3, 1], Direction.up);
        scene.world.showSection([1, 3, 1, 3, 3, 1], Direction.up);
        scene.overlay.showOutline("green", {}, [3, 3, 1, 1, 3, 1], 40);
        scene.text(
          40,
          "按照配方搭建序列装配装置（啊好烦Jason自己完善说明吧）",
          [2, 3, 1]
        );
        scene.idle(40);

        // 物品参数
        let materials = [
          {
            position2: [3, 3, 1],
            position: [3.5, 6, 1.5],
            type: Item.of("64x create:cogwheel"),
          },
          {
            position2: [2, 3, 1],
            position: [2.5, 6, 1.5],
            type: Item.of("64x create:large_cogwheel"),
          },
          {
            position2: [1, 3, 1],
            position: [1.5, 6, 1.5],
            type: Item.of("64x minecraft:iron_nugget"),
          },
        ];

        // 开始bb
        scene.world.showSection([3, 4, 1, 1, 4, 1], Direction.down);
        scene.overlay.showOutline("green", {}, [3, 3, 1, 1, 3, 1], 40);
        scene.text(40, "给机械手放材料（啊好烦Jason自己完善说明吧）", [2, 3, 1]);
        scene.idle(40);

        // 材料
        materials.forEach((material) => {
          let i_k = scene.world.createItemEntity(material.position, [0, 0, 0], material.type);
          scene.idle(5);
          PonderUtil.removeEntity(scene, i_k)
          PonderUtil.modifyDeployer(scene, material.position2, material.type, "USE")
        });
        scene.addKeyframe();

        scene.idle(40);

        // 开始bb
        scene.overlay.showOutline("green", {}, [4, 1, 1], 40);
        scene.text(40, "起点处放入输入材料（啊好烦Jason自己完善说明吧）", [4, 1, 1]);
        scene.idle(60);

        // 创建金板然后5刻后落到传送带上kill掉
        let item_1 = scene.world.createItemEntity(
          util.grid.at(4, 2, 1),
          Direction.down,
          "create:golden_sheet"
        );
        scene.idle(5);
        PonderUtil.removeEntity(scene, item_1)

        // 创建在传送带上的金板
        let stall1 = PonderUtil.createItemOnBelt(scene, [4, 1, 1], Direction.down, "create:golden_sheet")

        // 开始加工
        scene.idle(10);
        PonderUtil.moveDeployer(scene, [3, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [3.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [3, 3, 1], -1, 10);
        PonderUtil.changeBeltItemTo(scene, stall1, new Item.of("create:incomplete_precision_mechanism"))
        PonderUtil.stallBeltItem(scene, stall1, false);

        PonderUtil.moveDeployer(scene, [2, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [2.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [2, 3, 1], -1, 10);
        PonderUtil.stallBeltItem(scene, stall1, false);

        PonderUtil.moveDeployer(scene, [1, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [1.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [1, 3, 1], -1, 10);
        PonderUtil.stallBeltItem(scene, stall1, true);
        PonderUtil.stallBeltItem(scene, stall1, false);

        scene.idle(5);

        scene.addKeyframe();

        scene.text(40, "如果为循环装配配方的话搭建个循环装置（待完善）");
        
        scene.world.showSection([1, 2, 1, 3, 2, 2], Direction.east);
        scene.idle(40);

        PonderUtil.flapFunnel(scene, [3, 2, 1], true);
        PonderUtil.flapFunnel(scene, [1, 2, 1], true);

        let stall2 = PonderUtil.createItemOnBelt(scene, [3, 1, 1], Direction.up, "create:incomplete_precision_mechanism");

        scene.idle(5);
        PonderUtil.moveDeployer(scene, [3, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [3.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [3, 3, 1], -1, 10);
        PonderUtil.stallBeltItem(scene, stall2, false);

        PonderUtil.moveDeployer(scene, [2, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [2.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [2, 3, 1], -1, 10);
        PonderUtil.stallBeltItem(scene, stall2, false);

        PonderUtil.moveDeployer(scene, [1, 3, 1], 1, 10);
        scene.idle(10);
        PonderUtil.spawnItemParticles(scene, [1.5, 1, 1.5], [0, 0, 0], Item.of("create:incomplete_precision_mechanism"), 5, 1)
        PonderUtil.moveDeployer(scene, [1, 3, 1], -1, 10);
        scene.addKeyframe();

        PonderUtil.changeBeltItemTo(scene, stall2, new Item.of("create:precision_mechanism"))
        scene.world.setBlock([0, 1, 1], "create:depot", false);
        scene.world.showSection([0, 1, 1], Direction.up);
        PonderUtil.stallBeltItem(scene, stall2, false);

        scene.idle(5);

        // 咕咕咕

        scene.overlay.showOutline("white", {}, util.grid.at(0, 1, 1), 40);
        scene.text(
          40,
          "牛魔的这东西真的需要教吗\n西米不必不写思索，一定是西米不必干的！",
          util.grid.at(0, 1, 1)
        );
      }
    );
});
