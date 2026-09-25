ServerEvents.recipes(e => {
    // 菜肴拼盘配方（原为 kubejs/data/cuisinedelight/recipes/ 下的数据包配方）
    /**
     * @param {string} holderItem 盘子物品ID
     * @param {Array} list 食材列表 [{bonus, ingredient, max, min, score}]
     */
    function plate_cuisine(holderItem, list) {
        // list 为复杂对象数组（含 bonus/min/max/score 与 food_type 特殊原料），须走 e.custom
        e.custom({
            type: "cuisinedelight:plate_cuisine",
            holderItem: holderItem,
            list: list,
            saturationBonus: 0.0,
            saturationBonusModifier: 0.0
        }).id(`cuisinedelight:${holderItem.split(":")[1]}`)
    }
    /** @param {string} foodType 食物类型 */
    function foodType(type) {
        return { type: "cuisinedelight:food_type", foodType: type }
    }
    /** @param {string} item 物品 */
    function item(id) {
        return { item: id }
    }
    /** @param {string} tag 标签 */
    function tag(id) {
        return { tag: id }
    }
    /**
     * @param {*} ingredient 食材
     * @param {number} bonus
     * @param {number} min
     * @param {number} max
     * @param {number} score
     */
    function entry(ingredient, bonus, min, max, score) {
        return { bonus: bonus, ingredient: ingredient, max: max, min: min, score: score }
    }

    plate_cuisine("cuisinedelight:fried_rice", [
        entry(tag("forge:grain/rice"), 0.1, 0.75, 1.25, 2.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:fried_pasta", [
        entry(tag("forge:pasta/raw_pasta"), 0.1, 0.75, 1.25, 2.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:fried_meat_and_melon", [
        entry(foodType("MEAT"), 0.1, 0.4, 1.6, 1.0),
        entry(item("minecraft:melon_slice"), 0.1, 0.2, 1.8, 2.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:fried_mushroom", [
        entry(tag("forge:mushrooms"), 0.1, 0.75, 1.25, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:ham_fried_rice", [
        entry(tag("forge:grain/rice"), 0.2, 0.4, 1.6, 2.0),
        entry(item("farmersdelight:ham"), 0.2, 0.2, 1.8, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:meat_fried_rice", [
        entry(tag("forge:grain/rice"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("MEAT"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:meat_pasta", [
        entry(tag("forge:pasta/raw_pasta"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("MEAT"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:meat_platter", [
        entry(foodType("MEAT"), 0.1, 0.75, 1.25, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:meat_with_seafood", [
        entry(foodType("MEAT"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("SEAFOOD"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:meat_with_vegetables", [
        entry(foodType("MEAT"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("VEG"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:mixed_fried_rice", [
        entry(tag("forge:grain/rice"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:mixed_pasta", [
        entry(tag("forge:pasta/raw_pasta"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:scrambled_egg_and_tomato", [
        entry(tag("forge:eggs"), 0.1, 0.3, 1.7, 1.0),
        entry(tag("forge:vegetables/tomato"), 0.1, 0.3, 1.7, 2.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:seafood_fried_rice", [
        entry(tag("forge:grain/rice"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("SEAFOOD"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:seafood_pasta", [
        entry(tag("forge:pasta/raw_pasta"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("SEAFOOD"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:seafood_platter", [
        entry(foodType("SEAFOOD"), 0.1, 0.75, 1.25, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:seafood_with_vegetables", [
        entry(foodType("SEAFOOD"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("VEG"), 0.1, 0.35, 1.65, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:vegetable_fried_rice", [
        entry(tag("forge:grain/rice"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("VEG"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:vegetable_pasta", [
        entry(tag("forge:pasta/raw_pasta"), 0.1, 0.4, 1.6, 1.0),
        entry(foodType("VEG"), 0.1, 0.3, 1.7, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
    plate_cuisine("cuisinedelight:vegetable_platter", [
        entry(foodType("VEG"), 0.1, 0.75, 1.25, 1.0),
        entry(foodType("NONE"), 0.1, 0, 1, 1.0)
    ])
})
