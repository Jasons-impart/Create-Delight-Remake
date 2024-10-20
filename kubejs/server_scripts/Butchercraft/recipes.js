ServerEvents.recipes((e) => {
  e.recipes.kubejs
    .shapeless("minecraft:slime_ball", ["minecraft:water_bucket", "butchercraft:gelatin"])
    .id("butchercraft:gelatin_to_slime_ball");
  e.recipes.create
    .mixing("minecraft:slime_ball", [Fluid.of("water", 250), "butchercraft:gelatin"])
    .id("butchercraft:mixing/gelatin_to_slime_ball");
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
  e.recipes.create.compacting(Fluid.of("ratatouille:mince_meat", 250), [
    "butchercraft:blood_sausage_mix",
    "#forge:salt",
  ]);
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
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("butchercraft:skinning_knife"),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("butchercraft:bone_saw"),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("butchercraft:gut_knife"),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of("butchercraft:butcher_knife"),
        ]),
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
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of(Item.of("butchercraft:gut_knife")),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of(Item.of("minecraft:shears")),
        ]),
        create.deploying(`butchercraft:${ani}_carcass`, [
          `butchercraft:${ani}_carcass`,
          Item.of(Item.of("butchercraft:skinning_knife")),
        ]),
      ])
      .transitionalItem(`butchercraft:${ani}_carcass`)
      .loops(1)
      .id(`createdelight:${ani}_zip_zip`);
  });
});
