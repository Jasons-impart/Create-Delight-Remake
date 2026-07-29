ServerEvents.recipes(event => {
    // 主控与子供应器成套使用，统一在火星阶段解锁。
    // 子供应器需要批量铺设，因此只用一张火星钢板作为阶段门槛。
    event.replaceInput(
        { id: "sequenced_pattern_provider:child_pattern_provider" },
        "create:andesite_alloy",
        "northstar:martian_steel_sheet"
    )

    // 主控数量较少，直接沿用黄铜样板供应器作为核心。
    event.replaceInput(
        { id: "sequenced_pattern_provider:master_pattern_provider" },
        "ae2:pattern_provider",
        "appliedcreate:brass_pattern_provider"
    )
})
