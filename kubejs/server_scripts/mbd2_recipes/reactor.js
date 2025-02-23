ServerEvents.recipes(e => {
    //铀棒发电
    e.recipes.mbd2.reactor()
     .inputItems("alexscaves:uranium_rod")
     .perTick(builder => builder
        .outputFE(2500)
     )
     .duration(600)
    //核反应燃料发电
     e.recipes.mbd2.reactor()
     .inputItems("create_new_age:nuclear_fuel")
     .perTick(builder => builder
        .outputFE(1000)
     )
     .duration(600)
})