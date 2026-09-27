# FancyMenu 主菜单装饰专题

FancyMenu 3.9.8 下动态控制装饰覆盖层（彩蛋、节日灯带）的机制、序列化格式与踩坑。布局文件在 `config/fancymenu/customization/`。

## 现状

| 文件 | 作用 |
|---|---|
| `menu_easter_eggs.txt` | 主菜单彩蛋：7 种氛围覆盖层，约 20% 概率互斥出现 |
| `festival_string_lights.txt` | 节日灯带：圣诞/元旦/春节窗口内显示，10 种精选灯带组合 + christmas_mode |
| `create.txt` | 主界面 UI；装饰覆盖层保持 `show_decoration_overlay = false` |

## 关键机制

1. **`show_decoration_overlay` 每帧重求值**。直接放 `random_number`/`randomtext` 会闪或秒没。稳定开关必须走变量：`getvariable` 读、`set_variable` 写。
2. **动作脚本在首帧渲染之后才执行**。打开界面时写变量会先闪旧值再被覆盖。掷骰挂在 `close_screen` 动作上，下次打开时变量已就位。首次启动后第一次进主菜单为空，离开再回来即正常。
3. **手写 `loading_requirement` 不被解析**，空容器等于永远通过，条件失效但布局仍显示。加条件必须用编辑器 UI 存盘。
4. **`calc` 是 exp4j**，只有 `+ - * / ^ sqrt 三角 对数 abs`，无 `>=`、`&&`。日期区间用 `switch_case` 白名单 + 月份×100+日 分数。
5. **布尔属性 manual 模式可塞占位符**，是单布局动态开关装饰覆盖层的唯一途径。
6. **日期占位符在菜单加载时生效**，改系统日期后需 Reload FancyMenu 或重启。

## 序列化格式

打开/关闭界面动作（写在布局的 `layout_action_executable_blocks` 内）：

```
layout_action_executable_blocks {
  close_screen_executable_block_identifier = <BID>
  [executable_block:<BID>][type:generic] = [executables:<AID>]
  [executable_action_instance:<AID>][action_type:set_variable] = 变量名:值
}
```

`set_variable` 的值支持嵌套占位符，替换后按第一个冒号拆成 name:value。

彩蛋显示开关示例（读变量）：

```
show_decoration_overlay = {"placeholder":"switch_case","values":{"value":"{"placeholder":"getvariable","values":{"name":"deco_pick"}}","cases":"snow:true","default":"false"}}
```

日期门控示例（月份×100+日白名单）：

```
{"placeholder":"switch_case","values":{"value":"{"placeholder":"calc","values":{"expression":"({"placeholder":"realtimemonth"}*100)+{"placeholder":"realtimeday"}","decimal":"false"}}","cases":"1220:true,...","default":"false"}}
```

## 调参

| 目标 | 位置 |
|---|---|
| 彩蛋概率 | `menu_easter_eggs.txt` 中 `set_variable` 的 `random_number` min/max 与 `cases`（1–28 为 none，29–35 为七种彩蛋） |
| 节日窗口 | `festival_string_lights.txt` 中 `show_decoration_overlay` 的 `cases`（分数=月×100+日） |
| 灯带组合切换频率 | `festival_string_lights.txt` 中 `randomtext` 的 `interval`（秒） |

## 已知取舍

- 游戏启动后第一次进主菜单无彩蛋（变量未掷），进选项再退回即可。
- 彩蛋整次菜单停留期间保留，不做中途随机消失。
- 浏览器 / GLSL / Buddy 不进彩蛋池。
