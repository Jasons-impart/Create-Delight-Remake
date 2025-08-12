let all_replacement_json_file = JsonIO.findJsonInDirectory('kubejs/config/replacements');
// 替换配置的文件结构：
// [ 
//     {
//         "to_item": "<item id>",
//         "from_items": { 
//              "<item id>": "<item所属creative tab id>", 
//              ...
//         }
//     },
//     ...
// ]

// <creative tab id> -> <from item id list> 的Map
let creative_tab_delete_items_map = {}
// <to item id> -> <from item id list> 的Map
let item_replace_map = {}
all_replacement_json_file.forEach(file => {
    let replacements = JsonIO.toArray(JsonIO.readJson(file))
    if (replacements != null) {
        replacements.forEach(replacement => {
            // console.log("Azdev: item: " + JsonIO.toString(replacement))
            // replacement是包含from_items和to_item的JsonObject
            replacement = replacement.getAsJsonObject()
            // from_item_infos 为 <item id> -> <item所属creative tab id> 的Map
            let from_item_infos = replacement.getAsJsonObject("from_items")
            let from_items = from_item_infos.keySet()
            from_items.forEach(from_item => {
                let creative_tab = String(from_item_infos.getAsJsonPrimitive(from_item))
                creative_tab = creative_tab.substring(1, creative_tab.length - 1)
                // console.log("Azdev: creative_tab: " + creative_tab)
                // console.log("Azdev: typeof" + typeof(creative_tab))
                // console.log("Azdev: from_item " + from_item + " | creative tab: " + creative_tab)
                if (creative_tab_delete_items_map[creative_tab] == null) {
                    creative_tab_delete_items_map[creative_tab] = []
                }
                // console.log("Azdev: from_item: " + from_item)
                // console.log("Azdev: typeof" + typeof(from_item))
                creative_tab_delete_items_map[creative_tab].push(from_item)
            })
            let to_item = String(replacement.getAsJsonPrimitive("to_item"))
            to_item = to_item.substring(1, to_item.length - 1)
            // console.log("Azdev: to_item: " + to_item)
            if (item_replace_map[to_item] == null) {
                item_replace_map[to_item] = from_items
            }
            else {
                item_replace_map[to_item] = item_replace_map[to_item].concat(from_items)
            }
        })
    }
})
global.creative_tab_delete_items_map = creative_tab_delete_items_map
global.item_replace_map = item_replace_map

Object.keys(global.creative_tab_delete_items_map).forEach(tab => {
    StartupEvents.modifyCreativeTab(String(tab), event => {
        let items_to_delete = global.creative_tab_delete_items_map[tab]
        // console.log("Azdev: list tab: " + tab)
        // console.log("Azdev: items to delete: " + items_to_delete)
        // console.log(items_to_delete)
        // console.log(typeof(items_to_delete[0]))
        event.remove(items_to_delete)
    })
})