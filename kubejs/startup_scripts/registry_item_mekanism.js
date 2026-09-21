// Mekanism 融合注册物：序列组装过渡物（create:sequenced_assembly 类型，JEI 不显示）
// incomplete_tier_installer 供 machine_tiers.js 的四级安装器链使用
// incomplete_factory 供 factories.js 的 36 条工厂链使用

StartupEvents.registry("item", e => {
    e.create("createdelight:incomplete_tier_installer", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_tier_installer")
    e.create("createdelight:incomplete_factory", "create:sequenced_assembly")
        .translationKey("item.createdelight.incomplete_factory")
})
