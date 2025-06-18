/**
 * 额应该叫背包 NBT 修改？
 * @param {number} inventorySlots 背包槽数
 * @param {number} upgradeSlots 背包升级槽数
 * @param {string} [name] 背包名字
 * @param {string} [clothColor] 表面颜色 (HEX 颜色代码)
 * @param {string} [borderColor] 边框颜色（HEX 颜色代码）
 */
function createBackpack(inventorySlots, upgradeSlots, name, clothColor, borderColor) {
  let backpackNBT = `{inventorySlots:${inventorySlots},upgradeSlots:${upgradeSlots}`;

  if (name !== undefined) {
    backpackNBT += `,display:{Name:'{"italic":false,"extra":[{"text":""},{"text":"${name}"}],"text":""}'}`;
  }

  if (clothColor !== undefined) {
    let clothColorDecimal = hexToDecimal(clothColor);
    backpackNBT += `,clothColor:${clothColorDecimal}`;
  }

  if (borderColor !== undefined) {
    let borderColorDecimal = hexToDecimal(borderColor);
    backpackNBT += `,borderColor:${borderColorDecimal}`;
  }

  backpackNBT += `}`;

  return Item.of("sophisticatedbackpacks:backpack", backpackNBT);
}

function hexToDecimal(hex) {
  hex = hex.replace(/^#/, "");
  return parseInt(hex, 16);
}