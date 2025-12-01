const $ParticleTypes = Java.loadClass("net.minecraft.core.particles.ParticleTypes")
const $BlockParticleOption = Java.loadClass("net.minecraft.core.particles.BlockParticleOption")
const $ItemParticleOption = Java.loadClass("net.minecraft.core.particles.ItemParticleOption")

let PonderUtil = {}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //粒子效果生成位置
 * @param { Internal.Vec3d_ } vec3d //粒子效果动量
 * @param { Internal.ItemStack } item //粒子效果来源物品
 * @param { number } count //粒子数量
 * @param { number } age //粒子寿命
 */
PonderUtil.spawnItemParticles = function(scene, position, vec3d, item, count, age) {
    scene.effects.emitParticles(
        position,
        scene.effects.particleEmitterWithinBlockSpace(new $ItemParticleOption($ParticleTypes.ITEM, item), vec3d), count, age)
}
/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { Internal.Selection } selection //修改的区域
 * @param { number } speed //修改的值
 */
PonderUtil.setKineticSpeed = function(scene, selection, speed){
    scene.world.setKineticSpeed(selection, speed);
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { Internal.Selection } selection //修改的区域
 * @param { number } modifier //对应数值
 */
PonderUtil.multiplyKineticSpeed = function(scene, selection, modifier) {
    scene.world.multiplyKineticSpeed(selection, modifier)
}
/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { Internal.EntityElement } entitylink //需要在创建entity的时候返回EntityLink
 */
PonderUtil.removeEntity = function(scene, entitylink) {
    scene.world.removeEntity(entitylink)
}
/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } beltLocation //传送带坐标
 * @param { Direction } insertionSide //从哪里进入传送带
 * @param { Internal.ItemStack } stack //具体的ItemStack
 * 
 * @returns { Internal.ElementLink }
 */
PonderUtil.createItemOnBelt = function(scene, beltLocation, insertionSide, stack) {
    return scene.world.createItemOnBelt(beltLocation, insertionSide, stack)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } beltLocation //传送带坐标
 */
PonderUtil.removeItemsFromBelt = function(scene, beltLocation) {
    scene.world.removeItemsFromBelt(beltLocation)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { Internal.ElementLink } link //需要在创建ItemOnBelt的时候返回BeltItemLink
 * @param { boolean } stalled //使物品在传送带上停止运动与否
 */
PonderUtil.stallBeltItem = function(scene, link, stalled) {
    scene.world.stallBeltItem(link, stalled)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { Internal.ElementLink } link //需要在创建ItemOnBelt的时候返回BeltItemLink
 * @param { Internal.ItemStack } newStack //转变成的ItemStack
 */
PonderUtil.changeBeltItemTo = function(scene, link, newStack) {
    return scene.world.changeBeltItemTo(link, newStack)
    // PonderUtil.removeItemsFromBelt(scene, beltLocation)
    // return PonderUtil.createItemOnBelt(scene, beltLocation, Direction.UP, newStack)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene
 * @param { BlockPos } position // 黄铜or鞍山漏斗坐标
 * @param { boolean } outward // 向外摆动or向内摆动，true为向内
 */
PonderUtil.flapFunnel = function(scene, position, outward) {
    scene.world.flapFunnel(position, outward)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //机械手坐标
 * @param { number } distance //机械手移动距离(移动出去后记得移动回来)
 * @param { number } duration //耗时ticks
 */
PonderUtil.moveDeployer = function(scene, position, distance, duration) {
    scene.world.moveDeployer(position, distance, duration)
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //机械手坐标
 * @param { Internal.ItemStack } heldItem //机械手手持物品
 * @param { "USE"|"ATTACK" } mode //机械手模式
 */
PonderUtil.modifyDeployer = function(scene, position, heldItem, mode) {
    scene.world.modifyBlockEntityNBT(position, nbt =>
        nbt.merge({
            HeldItem: { Count: heldItem.count, id: heldItem.id },
            Mode: mode,
        })
    )
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //挂肉钩坐标
 * @param { Internal.ItemStack } insertItem //挂肉钩内含物品
 * @param { number } stage //挂肉钩操作阶段
 */
PonderUtil.modifyMeatHook = function(scene, position, insertItem, stage) {
    scene.world.modifyBlockEntityNBT(position, nbt =>
        nbt.merge({
            inventory: {Items:[{Count:1,Slot:0,id:insertItem}]},
            stage: stage,
        })
    )
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //案板坐标
 * @param { Internal.ItemStack } insertItem //案板内含物品
 * @param { number } stage //案板操作阶段
 */
PonderUtil.modifyButcherBlock = function(scene, position, insertItem, stage) {
    scene.world.modifyBlockEntityNBT(position, nbt =>
        nbt.merge({
            inventory: {Items:[{Count:1,Slot:0,id:insertItem}]},
            stage: stage,
        })
    )
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } position //机械手坐标
 * @param { "USE"|"ATTACK" } mode //机械手模式
 */
PonderUtil.changeDeployerMode = function(scene, position, mode) {
    scene.world.modifyBlockEntityNBT(position, nbt =>
        nbt.merge({
            Mode: mode,
        })
    )
}

/**
 * 
 * @param { Internal.CreateSceneBuilder } scene 
 * @param { BlockPos } postion 
 */
PonderUtil.spoutProcessing = function(scene, postion) {
    scene.world.modifyBlockEntityNBT(postion, nbt => 
        nbt.putInt("ProcessingTicks", 20)
    )
}