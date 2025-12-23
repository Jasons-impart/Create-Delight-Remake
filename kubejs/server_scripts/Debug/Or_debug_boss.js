ItemEvents.rightClicked("createdelight:debug_reload_tool", e => {
  const { server, player } = e;
  if (player.isCrouching()) {
    player.swing()
    server.tell("§6[成功]已经重载server脚本（不包括配方）");
    server.runCommand("kubejs reload server_scripts");
  } else {
    player.swing()
    server.tell("§6[成功]已经重载client脚本");
    server.runCommand("kubejs reload server_scripts");
  }
  return;
});

const $Registries = Java.loadClass("net.minecraft.core.registries.Registries")
ItemEvents.rightClicked("createdelight:debug_info_tool", e => {
  const { level, player } = e;
  let playerPos = player.block.pos
  if (player.isCrouching()) {
    player.swing()
    /** @type {Internal.Structure[]} */
    let structureArray = level.structureManager().getAllStructuresAt(playerPos).keySet().toArray()
    let structureRegistry = level.registryAccess().registryOrThrow($Registries.STRUCTURE)
    for (let structure of structureArray) {
      let structureStart = level.structureManager().getStructureAt(playerPos, structure)
      if (structureStart.isValid()) {
        let structureName = structureRegistry.getKey(structure).toString()
        let message = Component.of("§7- §a"+ structureName).clickCopy(structureName).hover("Structure ID(Click to Copy)")
        player.tell("Locate Structure:")
        player.tell(message) 
      }
    }
  } else {
    e.cancel()
  }
  return;
});
BlockEvents.rightClicked(e => {
  const { block, level, player } = e;
  if(player.mainHandItem.id == "createdelight:debug_info_tool"){
    let blockpos = block.pos;
    try {
      let blockEntityID = block.getEntityId();
      let beOptional = level.getBlockEntity(blockpos, blockEntityID);
      let blockEntityNBT = beOptional.get().serializeNBT();
      player.swing();
      player.tell("BlockEntityNBT:");
      let keys = blockEntityNBT.getAllKeys().toArray();
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let valueTag = blockEntityNBT.get(key);
        let valueStr = String(valueTag); // Tag 转为可读字符串
        let line = `${key}: ${valueStr}`;
        let message = Component.of(`§7- §e${key}§7: §a${valueStr}`)
          .clickCopy(line)
          .hover(`NBT ${key} (Click to Copy)`);
        player.tell(message);
      }
    } catch (error) { }
    e.cancel()
  }
})