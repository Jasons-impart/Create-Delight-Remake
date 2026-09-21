// Mekanism 关键物品的 JEI 信息页（照包内三元组规范：key + zh + en 同步挂语言）
let mekInfos = [
    ["mekanism:basic_tier_installer",
        "§b对机器右键§r即可原地升级，机器内的配方与缓存全部保留。\n§7安装器由装配线序列装配生产，材料取决于目标等级。",
        "§bRight-click a machine§r to upgrade it in place. Recipes and buffers are kept.\n§7Produced on a Create assembly line; materials depend on target tier."],
    ["mekanism:digital_miner",
        "§6数字采矿机§r：配置过滤器后远程采矿（半径最大32），可设精准采集与回填。\n§7它的原型机是 Create 数字矿机（COE）——提取器正是其核心部件。",
        "§6Digital Miner§r: remote mining with filters (radius up to 32), silk touch and replacement supported.\n§7The COE extractor is its prototype core."],
    ["mekanism:geiger_counter",
        "§c辐射警告§r：核废料、钚、钋和熔毁的反应堆会污染环境。\n剂量过高时屏幕出现绿滤镜并开始扣血，无视护甲。\n§7防护：防化服或 MekaSuit 辐射防护模块。可用 /mek radiation cure 治疗。",
        "§cRadiation warning§r: nuclear waste, plutonium, polonium and reactor meltdowns contaminate the area.\nHigh dosage tints the screen green and deals armor-piercing damage.\n§7Protection: hazmat suit or MekaSuit radiation shielding. Cure: /mek radiation cure."],
    ["appmek:chemical_cell_housing",
        "§d化学品元件外壳§r：由锇锭压弯制成，与 AE2 元件外壳同一产线。\n制成的化学品存储元件可让 ME 网络存储气体与浆料。",
        "§dChemical Cell Housing§r: curved from osmium ingots on the same line as AE2 cell housings.\nChemical cells let the ME network store gases and slurries."],
]

mekInfos.forEach(([key, zh_cn, en_us]) => {
    JEIEvents.information(event => event.addItem(key, Text.translate(key)))
    ClientEvents.lang("zh_cn", e => e.add(key, zh_cn))
    ClientEvents.lang("en_us", e => e.add(key, en_us))
})
