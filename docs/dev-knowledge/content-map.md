# Content Implementation Map

Use this file for content-facing pack knowledge: what has been changed, how it roughly works, and where the implementation lives.

| Area | Player-facing change | Implementation sketch | Primary locations | Related docs | Status |
|---|---|---|---|---|---|
| Order system | Players submit produced foods through orders for money, reputation, and themed progression. | KubeJS startup data defines customers/orders, server scripts handle delivery, and LC config supports unlockable supply channels. | `kubejs/startup_scripts/custom/order/`, `kubejs/server_scripts/mbd2/order_deliverer.js`, `config/lightmanscurrency/PersistentTraders.json` | `docs/order-system-design.md`, `docs/order-acquisition-channels-plan.md`, `docs/order-time-and-automation-strategy.md` | Implemented skeleton with active design expansion. |

## Entry Template

| Area | Player-facing change | Implementation sketch | Primary locations | Related docs | Status |
|---|---|---|---|---|---|
| `<feature>` | `<what players see>` | `<how it roughly works>` | `<paths>` | `<docs or none>` | `<planned/implemented/needs validation>` |
