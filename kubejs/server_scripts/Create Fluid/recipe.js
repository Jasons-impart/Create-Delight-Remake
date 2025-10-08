ServerEvents.recipes(e => {
    const {create} = e.recipes
    e.replaceInput({id: "fluid:centrifugal_pump"}, "create:propeller", "create_sa:hydraulic_engine")

})