ServerEvents.recipes(e => {
    // 存储磁盘合成配方删除
    remove_recipes_id(e, [
        "refinedstorage:1k_storage_disk",
        "refinedstorage:4k_storage_disk",
        "refinedstorage:16k_storage_disk",
        "refinedstorage:64k_storage_disk",
        "refinedstorage:64k_fluid_storage_disk",
        "refinedstorage:256k_fluid_storage_disk",
        "refinedstorage:1024k_fluid_storage_disk",
        "refinedstorage:4096k_fluid_storage_disk"
    ])

    // 存储外壳合成
    e.recipes.create.sequenced_assembly("refinedstorage:storage_housing", "#forge:glass", [
        e.recipes.create.deploying("refinedstorage:storage_housing", ["refinedstorage:storage_housing", "#forge:dusts/redstone"]),
        e.recipes.create.deploying("refinedstorage:storage_housing", ["refinedstorage:storage_housing", "refinedstorage:quartz_enriched_iron"]),
        e.recipes.create.pressing("refinedstorage:storage_housing", "refinedstorage:storage_housing")
    ])
        .transitionalItem("refinedstorage:storage_housing")
        .loops(3)
        .id("refinedstorage:storage_housing")
    // 序列合成：1K存储元件
    e.custom({
        "type": "create:sequenced_assembly",
        "ingredient": {
            "item": "refinedstorage:quartz_enriched_iron"
        },
        "loops": 3,
        "results": [{
            "item": "refinedstorage:1k_storage_part"
        }],
        "sequence": [{
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_1k_storage_part"
            },
            [{
                "item": "refinedstorage:silicon"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_1k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_1k_storage_part"
            },
            [{
                "tag": "forge:dusts/redstone"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_1k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_1k_storage_part"
            },
            [{
                "tag": "forge:glass"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_1k_storage_part"
            }]
        },
        {
            "type": "create:pressing",
            "ingredients": [{
                "item": "createdelight:incompleted_1k_storage_part"
            }],
            "results": [{
                "item": "createdelight:incompleted_1k_storage_part"
            }]
        }
        ],
        "transitionalItem": {
            "item": "createdelight:incompleted_1k_storage_part"
        }
    })
        .id("refinedstorage:1k_storage_part")
    // 4K存储元件合成
    e.custom({
        "type": "create:sequenced_assembly",
        "ingredient": {
            "item": "refinedstorage:quartz_enriched_iron"
        },
        "loops": 3,
        "results": [{
            "item": "refinedstorage:4k_storage_part"
        }],
        "sequence": [{
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_4k_storage_part"
            },
            [{
                "item": "refinedstorage:basic_processor"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_4k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_4k_storage_part"
            },
            [{
                "tag": "forge:dusts/redstone"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_4k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_4k_storage_part"
            },
            [{
                "item": "refinedstorage:1k_storage_part"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_4k_storage_part"
            }]
        },
        {
            "type": "create:pressing",
            "ingredients": [{
                "item": "createdelight:incompleted_4k_storage_part"
            }],
            "results": [{
                "item": "createdelight:incompleted_4k_storage_part"
            }]
        }
        ],
        "transitionalItem": {
            "item": "createdelight:incompleted_4k_storage_part"
        }
    })
        .id("refinedstorage:4k_storage_part")
    // 16K存储元件合成
    e.custom({
        "type": "create:sequenced_assembly",
        "ingredient": {
            "item": "refinedstorage:quartz_enriched_iron"
        },
        "loops": 3,
        "results": [{
            "item": "refinedstorage:16k_storage_part"
        }],
        "sequence": [{
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_16k_storage_part"
            },
            [{
                "item": "refinedstorage:improved_processor"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_16k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_16k_storage_part"
            },
            [{
                "tag": "forge:dusts/redstone"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_16k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_16k_storage_part"
            },
            [{
                "item": "refinedstorage:4k_storage_part"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_16k_storage_part"
            }]
        },
        {
            "type": "create:pressing",
            "ingredients": [{
                "item": "createdelight:incompleted_16k_storage_part"
            }],
            "results": [{
                "item": "createdelight:incompleted_16k_storage_part"
            }]
        }
        ],
        "transitionalItem": {
            "item": "createdelight:incompleted_16k_storage_part"
        }
    })
        .id("refinedstorage:16k_storage_part")
    // 64K存储元件合成
    e.custom({
        "type": "create:sequenced_assembly",
        "ingredient": {
            "item": "refinedstorage:quartz_enriched_iron"
        },
        "loops": 3,
        "results": [{
            "item": "refinedstorage:64k_storage_part"
        }],
        "sequence": [{
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_64k_storage_part"
            },
            [{
                "item": "refinedstorage:advanced_processor"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_64k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_64k_storage_part"
            },
            [{
                "tag": "forge:dusts/redstone"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_64k_storage_part"
            }]
        },
        {
            "type": "create:deploying",
            "ingredients": [{
                "item": "createdelight:incompleted_64k_storage_part"
            },
            [{
                "item": "refinedstorage:16k_storage_part"
            }]
            ],
            "results": [{
                "item": "createdelight:incompleted_64k_storage_part"
            }]
        },
        {
            "type": "create:pressing",
            "ingredients": [{
                "item": "createdelight:incompleted_64k_storage_part"
            }],
            "results": [{
                "item": "createdelight:incompleted_64k_storage_part"
            }]
        }
        ],
        "transitionalItem": {
            "item": "createdelight:incompleted_64k_storage_part"
        }
    })
        .id("refinedstorage:64k_storage_part")
    // 64K流体存储元件合成
    const iner_64K = "createdelight:incompleted_64k_fluid_storage_part"
    e.recipes.create.sequenced_assembly("refinedstorage:64k_fluid_storage_part", "#forge:ingots/copper", [
        e.recipes.create.deploying(iner_64K, [iner_64K, "refinedstorage:silicon"]),
        e.recipes.create.deploying(iner_64K, [iner_64K, "create:fluid_tank"]),
        e.recipes.create.filling(iner_64K, [iner_64K, Fluid.of("water 100")]),
        e.recipes.create.deploying(iner_64K, [iner_64K, "#forge:glass"]),
        e.recipes.create.pressing(iner_64K, iner_64K)
    ])
        .transitionalItem(iner_64K)
        .id("refinedstorage:64k_fluid_storage_part")
        .loops(3)
    // 256K流体存储元件合成
    const iner_256K = "createdelight:incompleted_256k_fluid_storage_part"
    e.recipes.create.sequenced_assembly("refinedstorage:256k_fluid_storage_part", "#forge:ingots/copper", [
        e.recipes.create.deploying(iner_256K, [iner_256K, "refinedstorage:basic_processor"]),
        e.recipes.create.deploying(iner_256K, [iner_256K, "create:fluid_tank"]),
        e.recipes.create.filling(iner_256K, [iner_256K, Fluid.of("water 200")]),
        e.recipes.create.deploying(iner_256K, [iner_256K, "refinedstorage:64k_fluid_storage_part"]),
        e.recipes.create.pressing(iner_256K, iner_256K)
    ])
        .transitionalItem(iner_256K)
        .id("refinedstorage:256k_fluid_storage_part")
        .loops(3)
    // 1024K流体存储元件合成
    const iner_1024 = "createdelight:incompleted_1024k_fluid_storage_part"
    e.recipes.create.sequenced_assembly("refinedstorage:1024k_fluid_storage_part", "#forge:ingots/copper", [
        e.recipes.create.deploying(iner_1024, [iner_1024, "refinedstorage:improved_processor"]),
        e.recipes.create.deploying(iner_1024, [iner_1024, "create:fluid_tank"]),
        e.recipes.create.filling(iner_1024, [iner_1024, Fluid.of("water 400")]),
        e.recipes.create.deploying(iner_1024, [iner_1024, "refinedstorage:256k_fluid_storage_part"]),
        e.recipes.create.pressing(iner_1024, iner_1024)
    ])
        .transitionalItem(iner_1024)
        .id("refinedstorage:1024k_fluid_storage_part")
        .loops(3)
    // 4096K流体存储元件合成
    const iner_4096 = "createdelight:incompleted_4096k_fluid_storage_part"
    e.recipes.create.sequenced_assembly("refinedstorage:4096k_fluid_storage_part", "#forge:ingots/copper", [
        e.recipes.create.deploying(iner_4096, [iner_4096, "refinedstorage:advanced_processor"]),
        e.recipes.create.deploying(iner_4096, [iner_4096, "create:fluid_tank"]),
        e.recipes.create.filling(iner_4096, [iner_4096, Fluid.of("water 800")]),
        e.recipes.create.deploying(iner_4096, [iner_4096, "refinedstorage:1024k_fluid_storage_part"]),
        e.recipes.create.pressing(iner_4096, iner_4096)
    ])
        .transitionalItem(iner_4096)
        .id("refinedstorage:4096k_fluid_storage_part")
        .loops(3)
})
