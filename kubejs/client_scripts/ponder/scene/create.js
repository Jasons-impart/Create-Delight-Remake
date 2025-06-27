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
        scene.world.setKineticSpeed(util.select.everywhere(), 32);
        scene.world.setKineticSpeed(util.grid.at(1, 0, 0), -32);

        // 开始bb
        scene.idle(20);
        scene.world.showSection(util.select.fromTo(1, 1, 0, 4, 1, 1), Direction.up);
        scene.world.showSection(util.select.fromTo(4, 1, 2, 4, 3, 1), Direction.up);
        scene.world.showSection(util.select.fromTo(1, 3, 1, 3, 3, 1), Direction.up);
        scene.overlay.showOutline("green", {}, util.select.fromTo(3, 3, 1, 1, 3, 1), 100);
        scene.text(
          100,
          "按照配方搭建序列装配装置（啊好烦Jason自己完善说明吧）",
          util.grid.at(2, 3, 1)
        );
        scene.idle(100);

        // 物品参数
        let materials = [
          {
            position2: util.grid.at(3, 3, 1),
            position: util.grid.at(3, 5, 1),
            type: "create:cogwheel",
          },
          {
            position2: util.grid.at(2, 3, 1),
            position: util.grid.at(2, 5, 1),
            type: "create:large_cogwheel",
          },
          {
            position2: util.grid.at(1, 3, 1),
            position: util.grid.at(1, 5, 1),
            type: "minecraft:iron_nugget",
          },
        ];

        // 开始bb
        scene.world.showSection(util.select.fromTo(3, 4, 1, 1, 4, 1), Direction.down);
        scene.overlay.showOutline("green", {}, util.select.fromTo(3, 3, 1, 1, 3, 1), 100);
        scene.text(100, "给机械手放材料（啊好烦Jason自己完善说明吧）", util.grid.at(2, 3, 1));
        scene.idle(100);

        // 材料
        materials.forEach((material) => {
          let i_k = scene.world.createItemEntity(material.position, Direction.up, material.type);
          scene.idle(5);
          scene.world.modifyEntity(i_k, (e) => {
            e.kill();
          });
          scene.world.modifyBlockEntityNBT(material.position2, (nbt) =>
            nbt.merge({
              HeldItem: { Count: 64, id: material.type },
              Inventory: [{ Count: 64, Slot: 0, id: material.type }],
              Mode: "USE",
            })
          );
        });
        scene.addKeyframe();

        scene.idle(40);

        // 开始bb
        scene.overlay.showOutline("green", {}, util.grid.at(4, 1, 1), 100);
        scene.text(100, "起点处放入输入材料（啊好烦Jason自己完善说明吧）", util.grid.at(4, 1, 1));
        scene.idle(60);

        // 创建金板然后5刻后落到传送带上kill掉
        let item_1 = scene.world.createItemEntity(
          util.grid.at(4, 2, 1),
          Direction.down,
          "create:golden_sheet"
        );
        scene.idle(5);
        scene.world.modifyEntity(item_1, (e) => {
          e.kill();
        });

        // 创建在传送带上的金板
        scene.world.createItemOnBeltLike(
          util.grid.at(4, 1, 1),
          Direction.down,
          "create:golden_sheet"
        );

        // 开始加工
        scene.idle(20);
        scene.world.moveDeployer(util.grid.at(3, 3, 1), 1, 10);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(3, 3, 1), -1, 10);
        scene.world.removeItemsFromBelt(util.grid.at(3, 1, 1));
        let stall1 = scene.world.createItemOnBelt(
          util.grid.at(3, 1, 1),
          Direction.up,
          "create:incomplete_precision_mechanism"
        );
        scene.world.stallBeltItem(stall1, false);

        scene.world.moveDeployer(util.grid.at(2, 3, 1), 1, 25);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(2, 3, 1), -1, 25);
        scene.world.stallBeltItem(stall1, false);

        scene.world.moveDeployer(util.grid.at(1, 3, 1), 1, 25);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(1, 3, 1), -1, 25);
        scene.world.stallBeltItem(stall1, true);

        scene.world.removeItemsFromBelt(util.grid.at(1, 1, 1));
        scene.world.flapFunnel(util.grid.at(1, 2, 1), true);
        scene.idle(5);

        scene.addKeyframe();

        scene.text(100, "如果为循环装配配方的话搭建个循环装置（待完善）");
        scene.world.showSection(util.select.fromTo(1, 2, 1, 3, 2, 2), Direction.east);
        scene.idle(100);

        scene.world.flapFunnel(util.grid.at(3, 2, 1), true);

        let stall2 = scene.world.createItemOnBelt(
          util.grid.at(3, 1, 1),
          Direction.up,
          "create:incomplete_precision_mechanism"
        );

        scene.idle(5);
        scene.world.moveDeployer(util.grid.at(3, 3, 1), 1, 10);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(3, 3, 1), -1, 10);
        scene.world.stallBeltItem(stall2, false);

        scene.world.moveDeployer(util.grid.at(2, 3, 1), 1, 25);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(2, 3, 1), -1, 25);
        scene.world.stallBeltItem(stall2, false);

        scene.world.moveDeployer(util.grid.at(1, 3, 1), 1, 25);
        scene.idle(40);
        scene.world.moveDeployer(util.grid.at(1, 3, 1), -1, 25);
        scene.addKeyframe();

        scene.world.removeItemsFromBelt(util.grid.at(1, 1, 1));
        let stall3 = scene.world.createItemOnBelt(
          util.grid.at(1, 1, 1),
          Direction.up,
          "create:precision_mechanism"
        );
        scene.world.setBlock(util.grid.at(0, 1, 1), "create:depot", false);
        scene.world.showSection(util.grid.at(0, 1, 1), Direction.up);
        scene.world.stallBeltItem(stall3, false);

        scene.idle(5);

        // 咕咕咕

        scene.overlay.showOutline("white", {}, util.grid.at(0, 1, 1), 100);
        scene.text(
          100,
          "牛魔的这东西真的需要教吗\n西米不必不写思索，一定是西米不必干的！",
          util.grid.at(0, 1, 1)
        );
      }
    );
});
