// 通用机械融合的注册物（P1）：基座、基片及序列组装过渡物
// 过渡物按包内惯例使用 create:sequenced_assembly 类型，JEI 不显示
StartupEvents.registry("item", e => {
    // 通用机械基座
    e.create("createdelight:mek_chassis")
        .translationKey("item.createdelight.mek_chassis")
    e.create("createdelight:incomplete_mek_chassis", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_mek_chassis")
    // 通用升级基片
    e.create("createdelight:upgrade_chip_base")
        .translationKey("item.createdelight.upgrade_chip_base")
    e.create("createdelight:incomplete_upgrade_chip_base", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_upgrade_chip_base")
})
