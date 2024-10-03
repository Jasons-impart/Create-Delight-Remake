// 代码源自Qi_Month的New Create
// 开发者用户信息
let playerName = [
	"Qi_Month",
	"hk11238981",
	"nanchuan211",
	"LuJiChi",
	"mi_xiao_bao",
	"LightLeaves",
	"ikoi03",
	"C_Pearl",
	"zhongxiaoli",
	"Maruyama_Ayaa",
	"XinJinIris",
	"cawyyds",
	"SSWTLZZ"
]
ItemEvents.rightClicked((event) => {
	const { item, player, server } = event

	for (let i = 0; i < playerName.length; i++) {
		// 潜行+右键获取物品ID
		if (player.mainHandItem === item.id &&
			player.crouching &&
			player.mainHandItem !== "minecraft:air" &&
			player.username === playerName[i]) {
			player.runCommandSilent("kubejs hand")
		}
	}
})

PlayerEvents.chat((event) => {
	const { player, message, server } = event

	for (let i = 0; i < playerName.length; i++) {
		// 输入-kli删除所有掉落物
		if (message.trim().equalsIgnoreCase("-kli") &&
			player.username === playerName[i]) {
			server.runCommandSilent("kill @e[type=item]")
			server.runCommandSilent("tellraw @a \"§4掉落物已清除\"")
			event.cancel()
		}

		// 输入-efg获得[夜视 力量 抗性]buff
		if (message.trim().equalsIgnoreCase("-efg") &&
			player.username === playerName[i]) {
			player.runCommandSilent("effect give @s minecraft:night_vision infinite 255 true")
			player.runCommandSilent("effect give @s minecraft:strength infinite 255 true")
			player.runCommandSilent("effect give @s minecraft:resistance infinite 255 true")
			player.runCommandSilent("tellraw @s \"§6已获得所有BUFF\"")
			event.cancel()
		}

		// 输入-efc清除自身所有buff
		if (message.trim().equalsIgnoreCase("-efc") &&
			player.username === playerName[i]) {
			player.runCommandSilent("effect clear")
			player.runCommandSilent("tellraw @s \"§4已清除所有BUFF\"")
			event.cancel()
		}

		// 输入-kle清除玩家之外的所有实体
		if (message.trim().equalsIgnoreCase("-kle") &&
			player.username === playerName[i]) {
			server.runCommandSilent("kill @e[type=!player]")
			server.runCommandSilent("tellraw @a \"§4所有实体已清除\"")
			event.cancel()
		}
	}
})

PlayerEvents.loggedIn((event) => {
	const { player } = event
	for (let i = 0; i < playerName.length; i++) {
		if (player.username === playerName[i]) {
			player.tell(Text.translate("message.createdelight.debug", [player.username]))
			player.tell(Text.translate("message.createdelight.conventcommand", [player.username]))
		}
	}
})
