//添加createdelight_tetra_module物品栏
StartupEvents.registry("creative_mode_tab", (event) => {
	// 注册创造物品栏，并给予创造物品栏id
	let tab = event.create("meng:createdelight_tetra_module")
    //定义物品栏标志
	tab.icon(() => Item.of("tetra:pale_steel_needle"))
	// 设置创造物品栏的显示名称,这里用的是本地化的键(在物品提示章节有提起过使用)
	tab.displayName = Text.translatable("item_group.meng.createdelight_tetra_module")
	//往物品栏里添加物品
	tab.content(() => [
		"tetra:pale_steel_needle"
	])
})
