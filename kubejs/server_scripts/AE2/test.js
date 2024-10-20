ItemEvents.rightClicked("create:wrench", (event) => {
  //   const { server } = event;
  //   server.tell("a");
  //   sendMessageA();
});
// ForgeEvents.onEvent("net.minecraftforge.event.level.BlockEvent$BreakEvent", (event) => {
// });

BlockEvents.broken(
    [
      "ae2:damaged_budding_quartz",
      "ae2:chipped_budding_quartz",
      "ae2:chipped_budding_quartz",
      "ae2:flawless_budding_quartz",
    ],
    (event) => {
      const { player, server } = event;
      if (player.isCrouching()) {
      } else {
        server.tell(
          "友情提示，石英母岩在破坏时会受损（你可以使用精准采集（无瑕除外）或者别的手段来搬运母岩）\n§6如果想要破坏的话请蹲下挖掘"
        );
        event.cancel();
      }
    }
  );
  