BlockEvents.broken(
  [
    "ae2:flawless_budding_quartz",
    "ae2:flawed_budding_quartz",
    "ae2:chipped_budding_quartz",
    "ae2:damaged_budding_quartz",
  ],
  e => {
    const { player, server } = e
    if (player.isCrouching()) {
    } else {
      player.tell(Text.translate("message.createdelight.budding_quartz"))
      e.cancel()
    }
  }
)
