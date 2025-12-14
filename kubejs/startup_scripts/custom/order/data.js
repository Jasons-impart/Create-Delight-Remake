
//订单原料的质量等级划分
Order.orderProperties = {
    food: {
        diversity: [1, 2, 3, 4], //默认的质量计算是根据多样性的。当食物大于第n-1个数小于第n个数时该食物的质量等级即为n
        base_count: 32 //base_count最终会*4
    },
    burger: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 64
    },
    sandwich: {
        diversity: [3.5, 4, 4.5, 5],
        base_count: 64
    },
    fast_food: {
        diversity: [4, 4.25, 4.5, 5],
        base_count: 64
    },
    milk_tea: {
        diversity: [-1, 0, 99, 99],
        base_count: 32
    },
    cookie: {
        diversity: [-1, 0, 99, 99],
        base_count: 16
    },
    tea: {
        diversity: [-1, -1, 99, 99],
        base_count: 32
    },
    western_wine: {
        diversity: [-1, 0, 99, 99],
        base_count: 16
    },
    eastern_wine: {
        diversity: [-1, -1, 99, 99],
        base_count: 16
    },
    drink: {
        diversity: [-1, -1, 99, 99],
        base_count: 32
    },
    ice_cream: {
        diversity: [-1, 0.6, 3, 99],
        base_count: 16
    },
    fried_food: {
        diversity: [-1, 1.5, 3, 99],
        base_count: 32
    },
    bread: {
        diversity: [-1, 1, 2.5, 99],
        base_count: 32
    },
    fruit: {
        diversity: [0, 1, 99, 99],
        base_count: 16
    },
    vegetable: {
        diversity: [0, 1, 99, 99],
        base_count: 16
    },
    crop: {
        diversity: [0, 1, 99, 99],
        base_count: 16
    },
    jello: {
        diversity: [-1, -1, 99, 99],
        base_count: 16
    },
    jam: {
        diversity: [-1, -1, 99, 99],
        base_count: 16
    },
    gummy: {
        diversity: [-1, -1, 99, 99],
        base_count: 16
    },
    coffee: {
        diversity: [-1, -1, 99, 99],
        base_count: 32
    },
    snack: {
        diversity: [-1, 0.3, 1, 99],
        base_count: 32
    },
    sushi: {
        diversity: [-1, 1, 3.5, 99],
        base_count: 32
    },
    popsicle: {
        diversity: [-1, 0.3, 0.7, 99],
        base_count: 32
    },
    noodle: {
        diversity: [-1, 3.5, 4.5, 99],
        base_count: 32
    },
    staple_food: {
        diversity: [0, 2, 4, 99],
        base_count: 64
    },
    barbecue: {
        diversity: [0, 1, 3, 99],
        base_count: 16
    },
    dessert: {
        diversity: [0, 1, 3, 99],
        base_count: 16
    },
    meat_dish: {
        diversity: [0, 2, 4, 99],
        base_count: 32
    },
    vegetarian_dish: {
        diversity: [0, 1, 3, 99],
        base_count: 32
    },
    mixed_dish: {
        diversity: [0, 2, 4, 99],
        base_count: 32
    },
    soup: {
        diversity: [0, 2, 4, 99],
        base_count: 16
    },
    rice: {
        diversity: [0, 2, 4, 99],
        base_count: 64
    },
    dumpling: {
        diversity: [0, 1, 3, 99],
        base_count: 32
    },
    monster: {
        diversity: [0, 1, 3, 99],
        base_count: 64
    },
    sauce: {
        diversity: [0, 1, 3, 99],
        base_count: 16
    },
    salad: {
        diversity: [0, 2, 4, 99],
        base_count: 16
    },
    wrap: {
        diversity: [0, 2, 4, 99],
        base_count: 64
    },
    cake: {
        diversity: [0, 0, 99, 99],
        base_count: 64
    },
    juice: {
        diversity: [0, 0, 99, 99],
        base_count: 32
    },
    sausage: {
        diversity: [0, 1, 3, 99],
        base_count: 32
    },
    milkshake: {
        diversity: [-1, -1, 3, 99],
        base_count: 16
    },
    
    pie: {
        diversity: [0, 0, 99, 99],
        base_count: 64
    },
}
//订单顾客的设定
Order.customerProperties = {// ===================== 矮人组织 =====================
    dwarven_bakery: {
        entries: {
            bread: [3, 2], //权重，最低品质需求
            sausage: [2, 1],
            meat_dish: [2, 2]
        },
        max_count: 3, //单个订单的最大要求数
        base_continue_rate: 0.4, //生成一个要求后再次生成的概率
        rarity: "COMMON", //稀有度
        chance: 0.9, //生成概率
        reward: ["createdelight:orders/random_hatbag", 3], //战利品表，奖励的基础份数
        reward_money: 500 //基础金钱奖励
    },

    dwarven_brewery: {
        entries: {
            western_wine: [3, 2],
            meat_dish: [2, 2],
            barbecue: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "UNCOMMON",
        chance: 0.85,
        reward: ["createdelight:orders/random_hatbag", 3],
        reward_money: 500
    },

    dwarven_snack_hall: {
        entries: {
            cookie: [2, 1],
            juice: [2, 1],
            fried_food: [1, 1]
        },
        max_count: 3,
        base_continue_rate: 0.5,
        rarity: "COMMON",
        chance: 0.8,
        reward: ["createdelight:orders/random_hatbag", 1],
        reward_money: 500
    },

    dwarven_feast_hall: {
        entries: {
            meat_dish: [3, 2],
            bread: [2, 1],
            staple_food: [2, 2]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "UNCOMMON",
        chance: 0.85,
        reward: ["createdelight:orders/random_hatbag", 3],
        reward_money: 500
    },

    // ===================== 精灵组织 =====================
    elven_tea_house: {
        entries: {
            tea: [3, 2],
            fruit: [2, 1],
            salad: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.5,
        rarity: "UNCOMMON",
        chance: 0.8,
        reward: ["createdelight:orders/random_doll", 1],
        reward_money: 500
    },

    elven_patisserie: {
        entries: {
            dessert: [3, 2],
            jam: [2, 1],
            jello: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.5,
        rarity: "UNCOMMON",
        chance: 0.75,
        reward: ["createdelight:orders/random_doll", 1],
        reward_money: 500
    },

    elven_sushi_bar: {
        entries: {
            sushi: [3, 2],
            rice: [2, 2],
            mixed_dish: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "RARE",
        chance: 0.7,
        reward: ["createdelight:orders/random_doll", 2],
        reward_money: 500
    },

    elven_juice_corner: {
        entries: {
            juice: [3, 2],
            popsicle: [2, 1],
            gummy: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.5,
        rarity: "COMMON",
        chance: 0.8,
        reward: ["createdelight:orders/random_doll", 1],
        reward_money: 500
    },

    // ===================== 怪物组织 =====================
    monster_feast_hall: {
        entries: {
            monster: [3, 2],
            fried_food: [2, 1],
            ice_cream: [1, 1]
        },
        max_count: 3,
        base_continue_rate: 0.3,
        rarity: "RARE",
        chance: 0.7,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    monster_lab: {
        entries: {
            meat_dish: [3, 2],
            sauce: [2, 1],
            snack: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "RARE",
        chance: 0.75,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    monster_canteen: {
        entries: {
            milkshake: [3, 2],
            popsicle: [2, 1],
            jello: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "UNCOMMON",
        chance: 0.7,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    monster_grill: {
        entries: {
            barbecue: [3, 2],
            fried_food: [2, 1],
            sausage: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.3,
        rarity: "RARE",
        chance: 0.75,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    // ===================== 人类组织 =====================
    human_cafe: {
        entries: {
            coffee: [3, 2],
            cake: [2, 1],
            sandwich: [2, 1],
            juice: [1, 1]
        },
        max_count: 4,
        base_continue_rate: 0.4,
        rarity: "COMMON",
        chance: 0.85,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    human_fast_food: {
        entries: {
            fast_food: [3, 2],
            burger: [2, 1],
            wrap: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "COMMON",
        chance: 0.85,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    human_bakery: {
        entries: {
            bread: [3, 2],
            pie: [2, 1],
            dessert: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.4,
        rarity: "UNCOMMON",
        chance: 0.8,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    },

    human_tea_house: {
        entries: {
            tea: [3, 2],
            milk_tea: [2, 1],
            cookie: [2, 1]
        },
        max_count: 3,
        base_continue_rate: 0.5,
        rarity: "UNCOMMON",
        chance: 0.8,
        reward: ["createdelight:orders/random_hatbag", 2],
        reward_money: 500
    }


};
Order.ticketColorMapping = {
    human_contract: 14464140,
}