- nanchuan211
- prithief
---
### 本文件对tetra材料编辑做出解释：
### 例如

```yaml
{
  "key": "bone",                      #key是物品的标识符（其实当成命名就行
  "category": "bone",                 #category为物品的类别/wood/stone/socket/skin/scale/rod/misc/metal/gem/fibre/fabic/bone
  "primary": 5,                       #primary 为硬度
  "secondary": 1.9,                   #secondary为密度
  "tertiary": 4.5,                    #tertiary为韧性
  "durability": 120,                  #durability为耐久 
  "integrityCost": 1,                 #integrityCost为所消耗的完整度
  "integrityGain": 5,                 #integrityGain为获得的完整度
  "magicCapacity": 108,               #magicCapacity为物品的魔法容量
  "toolLevel": "minecraft:stone",     #toolLevel为挖掘等级
  "toolEfficiency": 4.5,              #toolEfficiency为挖掘效率
  "tints": {                          #tints为物品的纹理效果（这个通常照着案例写就行，个人感觉影响不大）
    "glyph": "bone_glyph",            #glyph为物品的材质颜色
    "texture": "bone"                 #texture为物品在加工台的纹理
  },
  "textures": [ "bone", "crude" ],                        #贴图
  "material": { "items": [ "minecraft:bone" ] },          #材料id
  "requiredTools": { "hammer_dig": "minecraft:wood" }     #requiredTools为制作它所需的锻造等级（需要填材料，而不是数字）
}
```
### 本地化指南
文件\assets\tetra\lang\zh_cn.json（填你需要的语言）

或者你把tetra的zh_cn.json拿过来丢这也行（推荐）

"tetra.material.ssbs.prefix": "神圣宝石", 
"tetra.material.ssbs": "神圣宝石",
拆解开来就是：

 "tetra.material.<你的“key”里写的什么，这里就填什么>.prefix": "<你需要的汉化>", （锻造后的武器名称）

 "tetra.material.<你的“key”里写的什么，这里就填什么>": "<你需要的汉化>" （全息球内能看见的语言）