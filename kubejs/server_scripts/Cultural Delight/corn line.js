LootJS.modifiers(e => {
  e.addBlockLootModifier("corn_delight:wild_corn")
    .replaceLoot('corn_delight:corn_seeds', 'culturaldelights:corn_kernels')
})
//移除标签
ServerEvents.tags('item',e => {
      e.remove('forge:vegetables',['corn_delight:corn','culturaldelights:corn_cob'])
      e.remove('forge:vegetables/corn',['corn_delight:corn','culturaldelights:corn_cob'])})
ServerEvents.recipes(e => {
    e.remove({id:'culturaldelights:cutting/corn_kernels'})
    e.remove({id:'corn_delight:cutting/corn'})
    e.remove({input:'extradelight:unshucked_corn'})
    e.remove({id:'ratatouille:threshing/corn_cob'})
    e.remove({id:'culturaldelights:cutting/tortilla_chips'})
    e.remove({id:'corn_delight:cutting/tortilla_chip'})
    e.remove({id:'extradelight:cutting/corn_seeds_knife'})
    e.remove({id:'extradelight:corn_to_block'})
    e.remove({id:'corn_delight:corn_crate'})
    e.remove({id:'culturaldelights:corn_cob_crate'})
    e.remove({id:'extradelight:caramel_popcorn'})
    e.remove({id:'corn_delight:caramel_popcorn'})
    e.remove({output:'corn_delight:popcorn'})
    e.remove({output:'extradelight:popcorn'})
    e.remove({id:'extradelight:dynamic_feast/mortar/corn_meal'})
    e.replaceInput({input:'culturaldelights:tortilla'},'culturaldelights:tortilla','corn_delight:tortilla')
    e.remove({id:'culturaldelights:tortilla_chips'})
    e.remove({id:'culturaldelights:cooking/elote'})
    e.remove({id:'corn_delight:cooking/nachos_block'})
    e.remove({id:'culturaldelights:corn_dough'})
    e.remove({output:'corn_delight:corn_seeds'})
    e.remove({id:'culturaldelights:cooking/empanada'})
    e.remove({id:'corn_delight:cornbread_batter'})
    e.remove({id:"corn_delight:integration/create/mixing/cornbread_batter_from_mixing"})
    e.replaceInput({input:'corn_delight:corn'},'corn_delight:corn','extradelight:corn_on_cob')
    e.remove({id:'corn_delight:tortilla_raw'})
    e.remove({id:'culturaldelights:hearty_salad'})
    e.remove({output:'extradelight:grilled_corn_on_cob',type:"extradelight:oven"})
    e.remove({id:'corn_delight:cooking/boiled_corn'})
    e.remove({id:'corn_delight:cooking/creamed_corn'})
    e.remove({id:'corn_delight:cooking/caramel_popcorn'})
    e.remove({id:'corn_delight:cooking/cornbread_stuffing'})
    e.remove({id:'corn_delight:cooking/corn_soup'})
    e.remove({id:'culturaldelights:chicken_taco'})
    e.remove({id:'farmersdelight:cooking/fried_rice'})
    e.remove({id:'create:mixing/corn_create'})
    e.remove({id:'extradelight:corn'})
    e.remove({id:'culturaldelights:cooking/creamed_corn'})
    e.remove({id:'corn_delight:cooking/creamy_corn_drink'})
    e.remove({id:'corn_delight:integration/create/splashing/tortilla_raw'})
    e.remove({output:'corn_delight:grilled_corn'})
    e.remove({output:'corn_delight:corn_kernel_bag'})
    e.remove({id:"createcafe:mixing/syrups/caramel_syrup_mixing"})
    //丰盛沙拉玉米
    e.shapeless(
      'culturaldelights:hearty_salad', [
        "#forge:crops/tomato",
        "#culturaldelights:avocados",
        'extradelight:cooked_corn',
        "culturaldelights:cucumber",
        "minecraft:bowl"
      ]
    )
    //玉米适配砧板
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
          {
            "item":'culturaldelights:corn_cob'
          }
        ],
        "result": [
          { "item": "extradelight:corn_on_cob" },
          { "count": 2,
            "item": "extradelight:corn_husk"},
          { "item": "extradelight:corn_silk"},
          { "chance": 0.75,
            "item": "extradelight:corn_husk"}
        ],
        "tool": {
          "tag": "forge:tools/knives"
        }
      })
    //玉米适配脱粒机
    e.custom({
        "type": "ratatouille:threshing",
        "conditions": [
          {
            "type": "forge:mod_loaded",
            "modid": "culturaldelights"
          }
        ],
        "ingredients": [
          {
            "item": "culturaldelights:corn_cob"
          }
        ],
        "processingTime": 200,
        "results": [
          { item:'extradelight:corn_cob',},
          { item: "culturaldelights:corn_kernels",count:2},
          {item:'extradelight:corn_husk',count:2},
          {item:'culturaldelights:corn_kernels',chance:0.5}
        ]
      })
    //脱皮玉米脱粒
      e.custom({
        "type": "ratatouille:threshing",
        "conditions": [
          {
            "type": "forge:mod_loaded",
            "modid": "culturaldelights"
          }
        ],
        "ingredients": [
          {
            "item": 'extradelight:corn_on_cob'
          }
        ],
        "processingTime": 200,
        "results": [
          { item:'extradelight:corn_cob',},
          { item: "culturaldelights:corn_kernels",count:2},
          {item:'culturaldelights:corn_kernels',chance:0.5},
          {"item":'extradelight:corn_silk'}
        ]
      })
    //玉米片
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
          {
            "item": 'corn_delight:tortilla'
          }
        ],
        "tool": {
          "tag": "forge:tools/knives"
        },
        "result": [
          { "item": 'culturaldelights:tortilla_chips',
            "count": 3},
          { "item": 'culturaldelights:tortilla_chips',
            "chance": 0.5}
        ]})
    //去皮玉米砧板
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
          {
            "item": 'extradelight:corn_on_cob'
          }
        ],
        "result": [
          { "item": 'culturaldelights:corn_kernels',count:2},
          { "item": "extradelight:corn_cob",},
          {"item":'extradelight:corn_silk'}
        ],
        "tool": {
          "tag": "forge:tools/knives"
        }
      })
    //箱装玉米适配
    e.shaped('culturaldelights:corn_cob_crate',[
        "AAA","AAA","AAA"],
    {
        A:'culturaldelights:corn_cob'
    })
    //焦糖爆米花适配
    e.shapeless(Item.of('extradelight:caramel_popcorn'),[
        'culturaldelights:popcorn',
        'extradelight:caramel_sauce',
        'minecraft:bowl'])
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          item: 'culturaldelights:corn_kernels'
        },
        {
          item: 'extradelight:caramel_sauce'
        }
      ],
      "result": {
        "item": 'extradelight:caramel_popcorn'
      },"container": {
        "item": "minecraft:bowl"},
      "experience": 0.35,
      "cookingtime": 200
    })
    //玉米粒合成玉米粉
    e.custom({
      "type": "extradelight:mortar",
      "grinds": 4,
      "ingredient": {
        item:'culturaldelights:corn_kernels'
      },
      "result": {
        "item": "extradelight:corn_meal"
      }
    })
    //擀面杖擀玉米面团
    e.custom({
      "type": "extradelight:dough_shaping",
      "count": 2,
      "ingredient": {
        "item": 'culturaldelights:corn_dough'
      },
      "result": 'corn_delight:tortilla_raw'
    })
    //挤压玉米面团成面饼
    e.recipes.create.pressing(
      'corn_delight:tortilla_raw',
      'culturaldelights:corn_dough'
    )
    //烤奶酪辣味玉米片
    e.custom( {"type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": 'culturaldelights:tortilla_chips'
        },
        {
          "item": 'culturaldelights:tortilla_chips'
        },
        [
          {
            "tag": "forge:cooked_chicken"
          },
          {
            "tag": "forge:cooked_pork"
          },
          {
            "tag": "forge:cooked_beef"
          },
          {
            "tag": "forge:cooked_mutton"
          }
        ],
        {
          "tag": "forge:milk"
        },
        {
          "item": 'casualness_delight:spicy_strips'
        }
      ],
      "result": {
        "item": "corn_delight:nachos_block"
      },
      "container": {
        "item": "minecraft:bowl"
      },
      "experience": 0.35,
      "cookingtime": 200})
    //奶酪玉米棒
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": 'extradelight:corn_on_cob'
        },
        {
          "tag": "forge:milk"
        }
      ],
      "result": {
        "item": "culturaldelights:elote",
        "count": 1
      },
      "container": {
        "item": "minecraft:stick"
      },
      "experience": 0.2,
      "cookingtime": 200
    })
    //粉碎玉米粒成粗玉米粉
    e.recipes.create.crushing(['extradelight:corn_meal',Item.of('extradelight:corn_meal').withChance(0.5)],'culturaldelights:corn_kernels')
    e.recipes.create.milling('extradelight:corn_meal','culturaldelights:corn_kernels')
    //玉米面粉合成面团
    e.shapeless(Item.of('3x culturaldelights:corn_dough'),
  ['3x extradelight:corn_meal','minecraft:water_bucket'])
    e.recipes.create.splashing('culturaldelights:corn_dough','extradelight:corn_meal')
    e.recipes.create.mixing('3x culturaldelights:corn_dough',['3x extradelight:corn_meal',Fluid.water(1000)])
    e.custom({
      "type": "createdieselgenerators:basin_fermenting",
      "ingredients": [
        {"item": 'extradelight:corn_meal'},
        {"fluid": "minecraft:water",
          "amount": 100}],
      "processingTime": 200,
      "results": [
        {"item": 'culturaldelights:corn_dough'},
        {"item": 'extradelight:corn_meal',
          "chance": 0.1}]
    })
  //奶香玉米粒
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          item: 'culturaldelights:corn_kernels'
        },
        {
          "tag": "forge:milk"
        }
      ],
      "result": {
        "item": "corn_delight:creamed_corn"
      },
      "experience": 0.35,
      "cookingtime": 200
    })
    //袋装玉米粒分解
    e.shapeless(Item.of('9x culturaldelights:corn_kernels'),
  'corn_delight:corn_kernel_bag')
  //恩潘纳达炸饺
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": 'corn_delight:tortilla_raw'
        },
        {
          "item": 'corn_delight:tortilla_raw'
        },
        {
          "tag": "culturaldelights:avocados"
        },
        {
          "tag": "forge:crops/tomato"
        },
        {
          "tag": "forge:crops/onion"
        }
      ],
      "result": {
        "item": "culturaldelights:empanada",
        "count": 2
      },
      "experience": 0.1,
      "cookingtime": 100
    }).id('culturaldelights:cooking/empanada')
    //玉米面糊
    e.custom({
      "type": "minecraft:crafting_shapeless",
      "ingredients": [
        {"item": 'extradelight:corn_meal'},
        {"item": 'extradelight:corn_meal'},
        {"tag": "forge:milk"},
        {"tag": "forge:eggs"}
      ],"result": {
        "item": "corn_delight:cornbread_batter",
        "count": 3}
    })
    e.recipes.create.mixing("corn_delight:cornbread_batter",['2x extradelight:corn_meal','#forge:eggs',Fluid.of('minecraft:milk',250)])
    //煮玉米
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          'item': 'extradelight:corn_on_cob'
        }
      ],
      "result": {
        "item": "corn_delight:boiled_corn"
      },
      "experience": 0.15,
      "cookingtime": 100
    })
    //烤玉米棒
    e.custom({
      "type": "extradelight:oven",
      "container": {
        "item": "extradelight:sheet"},
      "cookingtime": 800,
      "experience": 1.0,
      "ingredients": [
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'},
        {"item": 'extradelight:corn_on_cob'}
      ],
      "recipe_book_tab": "meals",
      "result": {"count": 9,
        "item": 'extradelight:grilled_corn_on_cob'}})
        e.custom({
          "type": "extradelight:oven",
          "container": {
            "item": "extradelight:sheet"},
          "cookingtime": 800,
          "experience": 1.0,
          "ingredients": [
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'},
            {"item": 'extradelight:corn_on_cob'}
          ],
          "recipe_book_tab": "meals",
          "result": {"count": 8,
            "item": "extradelight:toast"}})
      e.custom({
        "type": "extradelight:oven",
        "container": {
          "item": "extradelight:sheet"},
        "cookingtime": 800,
        "experience": 1.0,
        "ingredients": [
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'},
          {"item": 'extradelight:corn_on_cob'}
        ],
        "recipe_book_tab": "meals",
        "result": {"count": 7,
          "item": 'extradelight:grilled_corn_on_cob'}})
          e.custom({
            "type": "extradelight:oven",
            "container": {
              "item": "extradelight:sheet"},
            "cookingtime": 800,
            "experience": 1.0,
            "ingredients": [
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'}
            ],
            "recipe_book_tab": "meals",
            "result": {"count": 6,
              "item": 'extradelight:grilled_corn_on_cob'}})
            e.custom({
            "type": "extradelight:oven",
            "container": {
              "item": "extradelight:sheet"},
            "cookingtime": 800,
            "experience": 1.0,
            "ingredients": [
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'},
              {"item": 'extradelight:corn_on_cob'}
            ],
            "recipe_book_tab": "meals",
            "result": {"count": 5,
              "item": 'extradelight:grilled_corn_on_cob'}})
              e.custom({
                "type": "extradelight:oven",
                "container": {
                  "item": "extradelight:sheet"},
                "cookingtime": 800,
                "experience": 1.0,
                "ingredients": [
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'}
                ],
                "recipe_book_tab": "meals",
                "result": {"count": 4,
                  "item": 'extradelight:grilled_corn_on_cob'}})
              e.custom({
                "type": "extradelight:oven",
                "container": {
                  "item": "extradelight:sheet"},
                "cookingtime": 800,
                "experience": 1.0,
                "ingredients": [
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'}
                ],
                "recipe_book_tab": "meals",
                "result": {"count": 3,
                  "item": 'extradelight:grilled_corn_on_cob'}})
             e.custom({
                "type": "extradelight:oven",
                "container": {
                  "item": "extradelight:sheet"},
                "cookingtime": 800,
                "experience": 1.0,
                "ingredients": [
                  {"item": 'extradelight:corn_on_cob'},
                  {"item": 'extradelight:corn_on_cob'}
                ],
                "recipe_book_tab": "meals",
                "result": {"count": 2,
                  "item": 'extradelight:grilled_corn_on_cob'}})
              e.custom({
                "type": "extradelight:oven",
                "container": {
                  "item": "extradelight:sheet"},
                "cookingtime": 800,
                "experience": 1.0,
                "ingredients": [
                  {"item": 'extradelight:corn_on_cob'}
                ],
                "recipe_book_tab": "meals",
                "result": {"count": 1,
                  "item": 'extradelight:grilled_corn_on_cob'}})
      //墨西哥鸡肉卷
      e.shapeless(Item.of('culturaldelights:chicken_taco'),
    ['corn_delight:tortilla',"#forge:cooked_chicken","#forge:crops/onion","farmersdelight:tomato_sauce","#culturaldelights:cucumbers"])
    //熟玉米
    e.custom({
      "type": "farmersdelight:cooking",
      "container": {
        "item": "minecraft:bowl"},
      "cookingtime": 100,
      "experience": 0.35,
      "ingredients": [
        {"item": 'culturaldelights:corn_kernels'}
      ],"result": {
        "item": "extradelight:cooked_corn"}})
    e.recipes.create.mixing("extradelight:cooked_corn",['culturaldelights:corn_kernels',"minecraft:bowl"]).heated()
    //玉米面包填馅
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": "corn_delight:cornbread"
        },
        {
          "item": 'corn_delight:boiled_corn'
        },
        {
          "item": "minecraft:baked_potato"
        },
        {
          "item": "minecraft:sweet_berries"
        }
      ],
      "result": {
        "item": "corn_delight:cornbread_stuffing"
      },
      "experience": 0.5,
      "cookingtime": 200
    })
    //玉米浓汤
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item":'corn_delight:boiled_corn'
        },
        {
          "tag": "forge:salad_ingredients"
        },
        [
          {
            "tag": "forge:raw_chicken"
          },
          {
            "tag": "forge:raw_pork"
          },
          {
            "tag": "forge:raw_beef"
          },
          {
            "item": "minecraft:brown_mushroom"
          }
        ],
        {
          "tag": "forge:milk"
        }
      ],
      "result": {
        "item": "corn_delight:corn_soup"
      },
      "experience": 0.35,
      "cookingtime": 200
    })
    //炒饭
    e.custom({
      "type": "farmersdelight:cooking",
      "cookingtime": 200,
      "experience": 1.0,
      "ingredients": [
        {
          "tag": "forge:crops/rice"
        },
        {
          "tag": "forge:eggs"
        },
        {
          "item": "minecraft:carrot"
        },
        {
          "tag": "forge:crops/onion"
        },
        {
          "item":'extradelight:cooked_corn'
        }
      ],
      "recipe_book_tab": "meals",
      "result": {
        "item": "farmersdelight:fried_rice"
      }
    })
    //奶油玉米
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": 'corn_delight:boiled_corn'
        },
        {
          "item": 'corn_delight:boiled_corn'
        },
        {
          "tag": "forge:milk"
        }
      ],
      "result": {
        "item": "culturaldelights:creamed_corn",
        "count": 1
      },
      "container": {
        "item": "minecraft:bowl"
      },
      "experience": 0.2,
      "cookingtime": 200
    })
    //奶香玉米饮
    e.custom({
      "type": "farmersdelight:cooking",
      "ingredients": [
        {
          "item": 'corn_delight:boiled_corn'
        },
        {
          "tag": "forge:milk"
        },
        {
          "item": "minecraft:sugar"
        }
      ],
      "result": {
        "item": "corn_delight:creamy_corn_drink"
      },
      "experience": 0.35,
      "cookingtime": 200
    })
    //焦糖适配
    e.recipes.create.filling('extradelight:caramel_sauce',['minecraft:glass_bottle',Fluid.of('create_confectionery:caramel',250)])
    e.recipes.create.emptying([Fluid.of('create_confectionery:caramel',250),'minecraft:glass_bottle'],'extradelight:caramel_sauce')
    //焦糖糖浆
    e.recipes.create.mixing([Fluid.of('createcafe:caramel_syrup',1000)],[Fluid.of('minecraft:milk',250),Fluid.of('create_confectionery:caramel',750)])
})