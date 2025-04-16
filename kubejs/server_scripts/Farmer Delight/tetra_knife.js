// priority: -10
ServerEvents.recipes(e => {
    /**
     * @type {InputItem_[]}
     */
    let input_black_list = [
        "culturaldelights:wild_cucumbers"
    ]
    e.remove({mod: "tetracelium"})
    // tetra切刀兼容
    e.forEachRecipe({ 'type': 'farmersdelight:cutting'}, recipes => {
        let data = JSON.parse(recipes.json.toString())
        let id = 'tetracelium:' + recipes.getId().split(':')[1] 
        + "from_" + recipes.getId().split(':')[0]
        // 提取配方的id，并重组成新id【避免冲突】
        if (input_black_list.indexOf(data.ingredients[0]?.item) == -1 && data.tool?.tag == "forge:tools/knives") {
            // 判断这个配方是否使用tag判断工具、tag是否为刀
            data.tool = { "type": "farmersdelight:tool_action", "action": "blade_cut" }
            // 替换工具为tetracelium的刀
            e.custom(data).id(id)
            // 添加这个配方
        }
    })
})