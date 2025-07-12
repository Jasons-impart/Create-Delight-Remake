ServerEvents.recipes((e) => {
  let {farmersdelight} = e.recipes
  // 动物胶水洗生成粘液球
  e.recipes.create.splashing(
    [
      'minecraft:slime_ball',
      Item.of("minecraft:slime_ball").withChance(0.1)
    ],
    '#forge:gelatin'
  ).id("butchercraft:splashing/gelatin")
  // 机械动力兼容相关
  const big_anms = [
    "beef",
    "pork",
    "lamb",
    "goat"
  ]
  big_anms.forEach(big_anm => {
    cutting(e, `butchercraft:${big_anm}_ribs`, [
      [`butchercraft:${big_anm}_roast`],
      ['minecraft:bone', 4]
    ])
    cutting(e, `butchercraft:cooked_${big_anm}_ribs`, [
      [`butchercraft:cooked_${big_anm}_roast`],
      ['minecraft:bone', 4]
    ])
    farmersdelight.cutting(`butchercraft:cubed_${big_anm}`, 'butchercraft:butcher_knife', [`2x butchercraft:${big_anm}_stewmeat`])
    farmersdelight.cutting(`butchercraft:cooked_cubed_${big_anm}`, 'butchercraft:butcher_knife', [`2x butchercraft:cooked_${big_anm}_stewmeat`])
    e.recipes.create.milling(
      `butchercraft:ground_${big_anm}`,
      `butchercraft:${big_anm}_stewmeat`
    ).id(`create:milling/${big_anm}_stewmeat`)
    e.recipes.create.milling(
      `2x butchercraft:ground_${big_anm}`,
      `butchercraft:cubed_${big_anm}`
    ).id(`create:milling/cubed_${big_anm}`)
    e.recipes.create.milling(
      `4x butchercraft:ground_${big_anm}`,
      `butchercraft:${big_anm}_scraps`
    ).id(`create:milling/${big_anm}_scraps`)
    e.recipes.create.milling(
      `butchercraft:cooked_ground_${big_anm}`,
      `butchercraft:cooked_${big_anm}_stewmeat`
    ).id(`create:milling/cooked_${big_anm}_stewmeat`)
    e.recipes.create.milling(
      `2x butchercraft:cooked_ground_${big_anm}`,
      `butchercraft:cooked_cubed_${big_anm}`
    ).id(`create:milling/cooked_cubed_${big_anm}`)
    e.recipes.create.milling(
      `4x butchercraft:cooked_ground_${big_anm}`,
      `butchercraft:cooked_${big_anm}_scraps`
    ).id(`create:milling/cooked_${big_anm}_scraps`)
  });
  const small_anms = [
    "chicken",
    "rabbit"
  ]
  small_anms.forEach(small_anm => {
    farmersdelight.cutting(`butchercraft:cubed_${small_anm}`, 'butchercraft:butcher_knife', `2x butchercraft:${small_anm}_stewmeat`)
    farmersdelight.cutting(`butchercraft:cooked_cubed_${small_anm}`, 'butchercraft:butcher_knife', [`2x butchercraft:cooked_${small_anm}_stewmeat`])
    e.recipes.create.milling(
      `butchercraft:ground_${small_anm}`,
      `butchercraft:${small_anm}_stewmeat`
    ).id(`create:milling/${small_anm}_stewmeat`)
    e.recipes.create.milling(
      `2x butchercraft:ground_${small_anm}`,
      `butchercraft:cubed_${small_anm}`
    ).id(`create:milling/cubed_${small_anm}`)
    e.recipes.create.milling(
      `4x butchercraft:ground_${small_anm}`,
      `butchercraft:${small_anm}_scraps`
    ).id(`create:milling/${small_anm}_scraps`)
    e.recipes.create.milling(
      `butchercraft:cooked_ground_${small_anm}`,
      `butchercraft:cooked_${small_anm}_stewmeat`
    ).id(`create:milling/cooked_${small_anm}_stewmeat`)
    e.recipes.create.milling(
      `2x butchercraft:cooked_ground_${small_anm}`,
      `butchercraft:cooked_cubed_${small_anm}`
    ).id(`create:milling/cooked_cubed_${small_anm}`)
    e.recipes.create.milling(
      `4x butchercraft:cooked_ground_${small_anm}`,
      `butchercraft:cooked_${small_anm}_scraps`
    ).id(`create:milling/cooked_${small_anm}_scraps`)
  });
  // 牛肉
  farmersdelight.cutting( 'butchercraft:beef_roast', 'butchercraft:butcher_knife', ['4x minecraft:beef'])
  farmersdelight.cutting( 'butchercraft:cooked_beef_roast', 'butchercraft:butcher_knife', ['4x minecraft:cooked_beef'])
  farmersdelight.cutting( 'minecraft:beef', 'butchercraft:butcher_knife', ['2x butchercraft:cubed_beef'])
  farmersdelight.cutting( 'minecraft:cooked_beef', 'butchercraft:butcher_knife', ['2x butchercraft:cooked_cubed_beef'])
  e.recipes.create.cutting(
    "4x minecraft:beef",
    'butchercraft:beef_roast'
  ).id("create:cutting/beef_roast")
  e.recipes.create.cutting(
    "4x minecraft:cooked_beef",
    'butchercraft:cooked_beef_roast'
  ).id("create:cutting/cooked_beef_roast")
  e.recipes.create.milling(
    "4x butchercraft:ground_beef",
    "minecraft:beef"
  ).id("create:milling/beef")
  e.recipes.create.milling(
    "4x butchercraft:cooked_ground_beef",
    "minecraft:cooked_beef"
  ).id("create:milling/cooked_beef")
  // 猪肉
  farmersdelight.cutting('butchercraft:pork_roast', 'butchercraft:butcher_knife', ['4x minecraft:porkchop'])
  farmersdelight.cutting('butchercraft:cooked_pork_roast', 'butchercraft:butcher_knife', ['4x minecraft:cooked_porkchop'])
  farmersdelight.cutting('minecraft:porkchop', 'butchercraft:butcher_knife', ['2x butchercraft:cubed_pork'])
  farmersdelight.cutting('minecraft:cooked_porkchop', 'butchercraft:butcher_knife', ['2x butchercraft:cooked_cubed_pork'])
  e.recipes.create.cutting(
    "4x minecraft:porkchop",
    'butchercraft:pork_roast'
  ).id("create:cutting/pork_roast")
  e.recipes.create.cutting(
    "4x minecraft:cooked_porkchop",
    'butchercraft:cooked_pork_roast'
  ).id("create:cutting/cooked_pork_roast")
  e.recipes.create.milling(
    "4x butchercraft:ground_pork",
    "minecraft:porkchop"
  ).id("create:milling/porkchop")
  e.recipes.create.milling(
    "4x butchercraft:cooked_ground_pork",
    "minecraft:cooked_porkchop"
  ).id("create:milling/cooked_porkchop")
  // 羊肉
  farmersdelight.cutting('butchercraft:lamb_roast', 'butchercraft:butcher_knife', ['4x minecraft:mutton'])
  farmersdelight.cutting('butchercraft:cooked_lamb_roast', 'butchercraft:butcher_knife', ['4x minecraft:cooked_mutton'])
  farmersdelight.cutting('minecraft:mutton', 'butchercraft:butcher_knife', ['2x butchercraft:cubed_lamb'])
  farmersdelight.cutting('minecraft:cooked_mutton', 'butchercraft:butcher_knife', ['2x butchercraft:cooked_cubed_lamb'])
  e.recipes.create.cutting(
    "4x minecraft:mutton",
    'butchercraft:lamb_roast'
  ).id("create:cutting/lamb_roast")
  e.recipes.create.cutting(
    "4x minecraft:cooked_mutton",
    'butchercraft:cooked_lamb_roast'
  ).id("create:cutting/cooked_lamb_roast")
  e.recipes.create.milling(
    "4x butchercraft:ground_lamb",
    "minecraft:mutton"
  ).id("create:milling/mutton")
  e.recipes.create.milling(
    "4x butchercraft:cooked_ground_lamb",
    "minecraft:cooked_mutton"
  ).id("create:milling/cooked_mutton")
  // 山羊肉
  farmersdelight.cutting('butchercraft:goat_roast', 'butchercraft:butcher_knife', ['4x butchercraft:goat_chop'])
  farmersdelight.cutting('butchercraft:cooked_goat_roast', 'butchercraft:butcher_knife', ['4x butchercraft:cooked_goat_chop'])
  farmersdelight.cutting('butchercraft:goat_chop', 'butchercraft:butcher_knife', ['2x butchercraft:cubed_goat'])
  farmersdelight.cutting('butchercraft:cooked_goat_chop', 'butchercraft:butcher_knife', ['2x butchercraft:cooked_cubed_goat'])
  e.recipes.create.cutting(
    "4x butchercraft:goat_chop",
    'butchercraft:goat_roast'
  ).id("create:cutting/goat_roast")
  e.recipes.create.cutting(
    "4x butchercraft:cooked_goat_chop",
    'butchercraft:cooked_goat_roast'
  ).id("create:cutting/cooked_goat_roast")
  e.recipes.create.milling(
    "4x butchercraft:ground_goat",
    "butchercraft:goat_chop"
  ).id("create:milling/goat_chop")
  e.recipes.create.milling(
    "4x butchercraft:cooked_ground_goat",
    "butchercraft:cooked_goat_chop"
  ).id("create:milling/cooked_goat_chop")
  // 鸡肉
  cutting(e, 'butchercraft:chicken_breast', [['butchercraft:cubed_chicken', 2]])
  cutting(e, 'butchercraft:chicken_leg', [
    ['butchercraft:cubed_chicken'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:chicken_thigh', [
    ['butchercraft:cubed_chicken'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:chicken_wing', [
    ['butchercraft:cubed_chicken'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:cooked_chicken_breast', [['butchercraft:cooked_cubed_chicken', 2]])
  cutting(e, 'butchercraft:cooked_chicken_leg', [
    ['butchercraft:cooked_cubed_chicken'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:cooked_chicken_thigh', [
    ['butchercraft:cooked_cubed_chicken'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:cooked_chicken_wing', [
    ['butchercraft:cooked_cubed_chicken'],
    ['minecraft:bone']
  ])
  // 兔肉
  cutting(e, 'butchercraft:rabbit_saddle', [['butchercraft:cubed_rabbit', 2]])
  cutting(e, 'butchercraft:rabbit_leg', [
    ['butchercraft:cubed_rabbit'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:rabbit_thigh', [
    ['butchercraft:cubed_rabbit'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:cooked_rabbit_saddle', [['butchercraft:cooked_cubed_rabbit', 2]])
  cutting(e, 'butchercraft:cooked_rabbit_leg', [
    ['butchercraft:cooked_cubed_rabbit'],
    ['minecraft:bone']
  ])
  cutting(e, 'butchercraft:cooked_rabbit_thigh', [
    ['butchercraft:cooked_cubed_rabbit'],
    ['minecraft:bone']
  ])

  e.recipes.kubejs
    .shapeless("minecraft:slime_ball", ["minecraft:water_bucket", "#forge:gelatin"])
    .id("butchercraft:gelatin_to_slime_ball");
  e.recipes.create
    .mixing("minecraft:slime_ball", [Fluid.of("water", 250), "#forge:gelatin"])
    .id("butchercraft:mixing/gelatin_to_slime_ball");
  e.recipes.create.cutting("8x minecraft:leather", "butchercraft:cow_hide")
  .id("butchercraft:cutting/cow_hide")
  e.recipes.create.cutting("6x minecraft:leather", "butchercraft:pig_hide")
  .id("butchercraft:cutting/pig_hide")
  e.recipes.create.cutting("6x minecraft:leather", "butchercraft:sheep_hide")
  .id("butchercraft:cutting/sheep_hide")
  e.recipes.create.cutting("6x minecraft:leather", "butchercraft:goat_hide")
  .id("butchercraft:cutting/goat_hide")
  cutting(e, "butchercraft:cow_hide", [["minecraft:leather", 8]])
  cutting(e, "butchercraft:pig_hide", [["minecraft:leather", 6]])
  cutting(e, "butchercraft:sheep_hide", [["minecraft:leather", 6]])
  cutting(e, "butchercraft:goat_hide", [["minecraft:leather", 6]])
  e.recipes.create.crushing(["4x minecraft:bone_meal",
    Item.of("minecraft:bone_meal", 4).withChance(0.25)], 
    [['butchercraft:cow_skull_head_item', 'butchercraft:sheep_skull_head_item', 'butchercraft:pig_skull_head_item', 'butchercraft:goat_skull_head_item']])
    .id("butchercraft:crushing/large_skull_head")
    e.recipes.create.crushing(["3x minecraft:bone_meal",
      Item.of("minecraft:bone_meal", 2).withChance(0.25)], 
      [['butchercraft:chicken_skull_head_item', 'butchercraft:rabbit_skull_head_item']])
      .id("butchercraft:crushing/small_skull_head")
  // 血肠混合料
  e.custom({
    type: "minecraft:crafting_shapeless",
    ingredients: [
      {
        tag: "forge:ground_meat/raw",
      },
      {
        tag: "forge:ground_meat/raw",
      },
      {
        tag: "forge:ground_meat/raw",
      },
      {
        tag: "forge:ground_meat/raw",
      },
      {
        tag: "forge:ground_meat/raw",
      },
      {
        tag: "forge:ground_meat/raw",
      },
      {
        item: "butchercraft:fat",
      },
      {
        item: "ratatouille:wheat_kernels",
      },
      {
        item: "butchercraft:blood_fluid_bottle",
      },
    ],
    result: {
      count: 8,
      item: "butchercraft:blood_sausage_mix",
    },
  }).id("butchercraft:blood_sausage_mix");

  e.recipes.create
    .mixing("8x butchercraft:blood_sausage_mix", [
      Ingredient.of("#forge:ground_meat/raw").withCount(6),
      Fluid.of("butchercraft:blood_fluid").withAmount(250),
      "butchercraft:fat",
      "ratatouille:wheat_kernels",
    ])
    .id("butchercraft:mixing/blood_sausage_mix");
  // e.recipes.create.compacting(Fluid.of("ratatouille:mince_meat", 250), [
  //   "butchercraft:blood_sausage_mix",
  //   "#forge:salt",
  // ]);
});

ServerEvents.recipes((event) => {
  const { create, vintageimprovements } = event.recipes;

  let ann = [
    [
      [
        "2x butchercraft:kidney",
        "butchercraft:liver",
        "4x butchercraft:stomach",
        "2x butchercraft:lung",
        "8x butchercraft:tripe",
        "6x butchercraft:beef_ribs",
        "21x butchercraft:beef_roast",
        "9x butchercraft:cubed_beef",
        "64x minecraft:beef",
        "3x butchercraft:oxtail",
        "9x minecraft:bone",
        "24x butchercraft:beef_stewmeat",
        "37x butchercraft:beef_scraps",
        "butchercraft:cow_head_item",
        "8x butchercraft:sinew",
        "8x butchercraft:fat",
        "15x butchercraft:leather_scrap",
        "butchercraft:cow_hide",
        "butchercraft:blood_fluid_bucket",
        "butchercraft:blood_fluid_bucket",
        "butchercraft:heart",
      ],
      "createdelight:cow_zip",
    ],
    [
      [
        "butchercraft:sheep_hide",
        "butchercraft:blood_fluid_bucket",
        "butchercraft:blood_fluid_bucket",
        "butchercraft:stomach",
        "2x butchercraft:lung",
        "4x butchercraft:tripe",
        "2x butchercraft:lamb_ribs",
        "7x butchercraft:lamb_roast",
        "2x butchercraft:cubed_lamb",
        "10x minecraft:mutton",
        "butchercraft:liver",
        "2x butchercraft:kidney",
        "butchercraft:heart",
        "13x minecraft:bone",
        "6x butchercraft:lamb_stewmeat",
        "9x butchercraft:lamb_scraps",
        "butchercraft:sheep_head_item",
        "9x butchercraft:sinew",
        "4x butchercraft:fat",
        "8x butchercraft:leather_scrap",
      ],
      "createdelight:sheep_zip",
    ],
    [
      [
        "14x minecraft:porkchop",
        "4x butchercraft:cubed_pork",
        "10x butchercraft:pork_roast",
        "6x butchercraft:pork_ribs",
        "8x butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "butchercraft:liver",
        "butchercraft:blood_fluid_bucket",
        "2x butchercraft:kidney",
        "butchercraft:heart",
        "2x farmersdelight:ham",
        "16x minecraft:bone",
        "10x butchercraft:pork_stewmeat",
        "12x butchercraft:pork_scraps",
        "butchercraft:pig_head_item",
        "26x butchercraft:sinew",
        "5x butchercraft:fat",
        "4x butchercraft:leather_scrap",
        "butchercraft:pig_hide",
        "butchercraft:blood_fluid_bucket",
      ],
      "createdelight:pig_zip",
    ],
    [
      [
        "2x butchercraft:lung",
        "butchercraft:tripe",
        "butchercraft:liver",
        "butchercraft:heart",
        "minecraft:chicken",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "19x minecraft:feather",
        "5x butchercraft:fat",
        "4x butchercraft:sinew",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:chicken_head_item",
      ],
      "createdelight:chicken_zip",
    ],
    [
      [
        "4x butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:leather_scrap",
        "16x butchercraft:sinew",
        "12x butchercraft:fat",
        "butchercraft:blood_fluid_bucket",
        "butchercraft:blood_fluid_bucket",
        "13x minecraft:bone",
        "butchercraft:goat_head_item",
        "butchercraft:goat_hide",
        "2x butchercraft:cubed_goat",
        "10x butchercraft:goat_chop",
        "butchercraft:heart",
        "7x butchercraft:goat_roast",
        "6x butchercraft:goat_stewmeat",
        "9x butchercraft:goat_scraps",
        "2x butchercraft:goat_ribs",
        "butchercraft:liver",
      ],
      "createdelight:goat_zip",
    ],
    [
      [
        "butchercraft:liver",
        "butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:sinew",
        "2x butchercraft:fat",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:rabbit_black_head_item",
        "minecraft:rabbit_hide",
        "minecraft:rabbit_foot",
        "minecraft:rabbit",
        "butchercraft:heart",
      ],
      "createdelight:black_rabbit_zip",
    ],
    [
      [
        "butchercraft:liver",
        "butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:sinew",
        "2x butchercraft:fat",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:rabbit_brown_head_item",
        "minecraft:rabbit_hide",
        "minecraft:rabbit_foot",
        "minecraft:rabbit",
        "butchercraft:heart",
      ],
      "createdelight:brown_rabbit_zip",
    ],
    [
      [
        "butchercraft:liver",
        "butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:sinew",
        "2x butchercraft:fat",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:rabbit_splotched_head_item",
        "minecraft:rabbit_hide",
        "minecraft:rabbit_foot",
        "minecraft:rabbit",
        "butchercraft:heart",
      ],
      "createdelight:splotched_rabbit_zip",
    ],
    [
      [
        "butchercraft:liver",
        "butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:sinew",
        "2x butchercraft:fat",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:rabbit_gold_head_item",
        "minecraft:rabbit_hide",
        "minecraft:rabbit_foot",
        "minecraft:rabbit",
        "butchercraft:heart",
      ],
      "createdelight:gold_rabbit_zip",
    ],
    [
      [
        "butchercraft:liver",
        "butchercraft:tripe",
        "2x butchercraft:lung",
        "butchercraft:stomach",
        "2x butchercraft:kidney",
        "5x butchercraft:sinew",
        "2x butchercraft:fat",
        "2x butchercraft:blood_fluid_bottle",
        "butchercraft:rabbit_white_head_item",
        "minecraft:rabbit_hide",
        "minecraft:rabbit_foot",
        "minecraft:rabbit",
        "butchercraft:heart",
      ],
      "createdelight:white_rabbit_zip",
    ],
  ];
  ann.forEach(([outp, inp]) => {
    create.item_application(outp, [inp, "#forge:tools/knives"]).id(`${inp}_unpack`);
  });

  ["cow", "sheep", "goat", "pig"].forEach((ani) => {
    create
      .sequenced_assembly(`createdelight:${ani}_zip`, `butchercraft:${ani}_carcass`, [
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("minecraft:bucket"),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("minecraft:bucket"),
        ]),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of("butchercraft:skinning_knife"),
          ])
          .keepHeldItem(),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of("butchercraft:bone_saw"),
          ])
          .keepHeldItem(),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of("butchercraft:gut_knife"),
          ])
          .keepHeldItem(),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of("butchercraft:butcher_knife"),
          ])
          .keepHeldItem(),
      ])
      .transitionalItem(`butchercraft:${ani}_carcass`)
      .loops(1)
      .id(`createdelight:${ani}_zip_zip`);
  });

  [
    "chicken",
    "white_rabbit",
    "black_rabbit",
    "brown_rabbit",
    "splotched_rabbit",
    "gold_rabbit",
  ].forEach((ani) => {
    create
      .sequenced_assembly(`createdelight:${ani}_zip`, `butchercraft:${ani}_carcass`, [
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("minecraft:glass_bottle"),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("minecraft:glass_bottle"),
        ]),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of(Item.of("butchercraft:gut_knife")),
          ])
          .keepHeldItem(),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of(Item.of("minecraft:shears")),
          ])
          .keepHeldItem(),
        create
          .deploying(`butchercraft:${ani}_carcass`, [
            `butchercraft:${ani}_carcass`,
            Item.of(Item.of("butchercraft:skinning_knife")),
          ])
          .keepHeldItem(),
      ])
      .transitionalItem(`butchercraft:${ani}_carcass`)
      .loops(1)
      .id(`createdelight:${ani}_zip_zip`);
  });
});
