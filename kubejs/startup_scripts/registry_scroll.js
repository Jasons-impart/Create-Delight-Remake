/**
 *
 * @param {number[]} glyphs 卷轴放置在世界的纹理（4个数字，随意填）
 * @param {number} intricate 是否为深奥原理图（0为不是，1为是）
 * @param {string} key 卷轴对应的键（用于本地化）
 * @param {number} material 卷轴身的材质
 * @param {string[]} schematics 卷轴可带来的模块改装
 * @param {string} ribbon 缠绕卷轴的丝带颜色（十六进制）
 * @returns {Internal.ItemStack}
 */
function custom_scroll(glyphs, intricate, key, material, schematics, ribbon) {
    return Item.of("tetra:scroll_rolled", {
      BlockEntityTag: {
        data: [
          {
            glyphs: glyphs,
            intricate: intricate,
            key: key,
            material: material,
            schematics: schematics,
            ribbon: ribbon,
          },
        ],
      },
    });
  }
  