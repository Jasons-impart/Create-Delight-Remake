# 内容实现地图

本文件记录内容向的整合包知识：已经做了什么、玩法上如何表现、实现大致在哪。

| 领域 | 玩家可见变化 | 实现概览 | 主要位置 | 相关文档 | 状态 |
|---|---|---|---|---|---|
| 订单系统 | 玩家提交量产食物订单，获得金钱、声望和主题进度反馈。 | KubeJS startup 数据定义顾客和订单，server 脚本处理交付，LC 配置承载可解锁供货渠道。 | `kubejs/startup_scripts/custom/order/`、`kubejs/server_scripts/mbd2/order_deliverer.js`、`config/lightmanscurrency/PersistentTraders.json` | `docs/order-system-design.md`、`docs/plan/order-acquisition-channels-plan.md`、`docs/plan/order-time-and-automation-strategy.md` | 主体骨架已实现，设计仍在扩展。 |
| HotAI 模组补丁 | 多个上游模组行为被二进制 patch：Create 分液池无限流体判断、Create Addition 超导线缆、TACZ 页签图标、若干兼容修复等。 | `mods/hotai-1.0.jar` 启动时读取 `hotai/*.badiff`，按 class 路径对目标模组字节码应用补丁；部分补丁还配合 KubeJS 资源、配方和掉落。 | `hotai/`、`mods/hotai.pw.toml`、`kubejs/assets/createaddition/`、`kubejs/server_scripts/Create Addition/`、`kubejs/server_scripts/Kinetic Pixel/` | `docs/hotai-patch-map.md`、`docs/hotai-badiff-details.md` | 已整理当前可还原补丁；部分目标类需启动验证。 |

## 条目模板

| 领域 | 玩家可见变化 | 实现概览 | 主要位置 | 相关文档 | 状态 |
|---|---|---|---|---|---|
| `<功能>` | `<玩家看到什么>` | `<大致如何工作>` | `<路径>` | `<文档或无>` | `<计划中/已实现/待验证>` |
