ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:honey_cookie",
        "create_central_kitchen:compacting/honey_cookie",
        "quark:tweaks/crafting/utility/bent/cookie",
        "minecraft:cookie",
        "create_central_kitchen:compacting/cookie",
        "farmersdelight:sweet_berry_cookie",
        "create_central_kitchen:compacting/sweet_berry_cookie",
        "create_central_kitchen:compacting/green_tea_cookie",
        "create_central_kitchen:compacting/chorus_cookie",
        "fruitsdelight:persimmon_cookie",
        "fruitsdelight:bayberry_cookie",
        "ends_delight:food/chorus_cookie",
        "fruitsdelight:cranberry_cookie",
        "fruitsdelight:lemon_cookie",
        "farmersrespite:green_tea_cookie"
    ])
    // 柿曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "item": 'fruitsdelight:dried_persimmon'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:persimmon_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "item": 'fruitsdelight:dried_persimmon'
            }
        ],
        "result": {
            "item": 'createdelight:persimmon_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:persimmon_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'fruitsdelight:persimmon_cookie'
        }
      })
    // 杨梅曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "item": 'fruitsdelight:bayberry'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:bayberry_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "item": 'fruitsdelight:bayberry'
            }
        ],
        "result": {
            "item": 'createdelight:bayberry_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:bayberry_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'fruitsdelight:bayberry_cookie'
        }
      })
    // 柠檬曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "item": 'fruitsdelight:lemon'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:lemon_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "item": 'fruitsdelight:lemon'
            }
        ],
        "result": {
            "item": 'createdelight:lemon_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:lemon_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'fruitsdelight:lemon_cookie'
        }
      })
    // 蔓越莓曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "item": 'farmersrespite:green_tea_leaves'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:cranberry_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "item": 'fruitsdelight:cranberry'
            }
        ],
        "result": {
            "item": 'createdelight:cranberry_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:cranberry_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'fruitsdelight:cranberry_cookie'
        }
      })
    // 紫颂果曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": 'forge:chorus_fruits'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:chorus_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "tag": 'forge:chorus_fruits'
            }
        ],
        "result": {
            "item": 'createdelight:chorus_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:chorus_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'ends_delight:chorus_cookie'
        }
      })
    // 绿茶曲奇
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "item": 'farmersrespite:green_tea_leaves'
            },
            {
                "tag": "forge:flour"
            },
            {
                "tag": "extradelight:sweetener"
            },
            {
                "tag": "forge:butter"
            },
            {
                "tag": "forge:eggs"
            }
        ],
        "result": {
            "item": 'createdelight:green_tea_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:mixing_bowl",
        "ingredients": [
            {
                "tag": "forge:cookie_dough/sugar"
            },
            {
                "item": 'farmersrespite:green_tea_leaves'
            }
        ],
        "result": {
            "item": 'createdelight:green_tea_cookie_dough'
        },
        "stirs": 4,
        "usedItem": {
            "item": "minecraft:air"
        }
    })
    e.custom({
        "type": "extradelight:oven",
        "container": {
            "item": "extradelight:sheet"
        },
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
            {
                "item": 'createdelight:green_tea_cookie_dough'
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "count": 8,
            "item": 'farmersrespite:green_tea_cookie'
        }
      })
})