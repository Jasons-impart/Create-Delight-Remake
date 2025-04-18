const $OreDataCapability = Java.loadClass("com.tom.createores.OreDataCapability")

BlockEvents.broken(e => {
    const {player, block} = e

    // player.tell("start")
    if (!block.hasTag("createdelight:cluster_mineable"))
        return
    if (player == null || !player.player || player.fake)
        return
    let y = block.pos.y
    function linear(val, start, end) {
        return val * (end - start) + start
    }
    let chance = Math.max(0, linear((y + 64) / 128, 1, 0)) * 0.05

    if (block.level.random.nextDouble() > chance)
        return
    if (!block.blockState.canHarvestBlock(block.level, block.pos, player))
        return

    let trunk = block.level.getChunk(block.pos)
    let oreData = $OreDataCapability.getData(trunk)
    if (oreData.getRecipe(block.level.getRecipeManager()) == null)
        return

    let veinId = oreData.getRecipe(block.level.getRecipeManager()).getId()
    /**
     * @type {Internal.DrillingRecipe}
     */
    let find = null
    block.level.getRecipeManager().getByType("createoreexcavation:drilling").forEach((id, r) => {
        /**
         * @type {Internal.DrillingRecipe}
         */
        let recipe = r
        if(recipe.veinId.equals(veinId))
            find = recipe
    })
    if (find == null)
        return
    if (!player.creative)
        block.popItem(find.getOutput().get(0).stack)
    
    block.setBlockState(Block.getBlock("minecraft:air").defaultBlockState(), 2)
    e.cancel()
})

ServerEvents.tags("minecraft:block", e => [
    e.add("createdelight:cluster_mineable",
        "#forge:stone",
        "minecraft:netherrack",
        "ad_astra:moon_stone",
        "ad_astra:mars_stone",
        "ad_astra:venus_sandstone",
        "ad_astra:mercury_stone",
        "ad_astra:glacio_stone",
        "ad_astra:venus_stone"
    )
])