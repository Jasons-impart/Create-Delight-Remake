fill ~-1 264 ~-1 ~49 264 ~49 air
# 注意这里place的位置必须要已加载，现在写法是相对玩家出生位置所以必定已加载
place template createdelight:spawn_platform ~ 248 ~
setworldspawn ~11 264 ~16
tp ~11 264 ~16
data modify storage spawn_create spawnpoint_structure set value "has_been_set"