ServerEvents.recipes(e => {
    e.remove({ type: "createaddition:liquid_burning" })
    e.remove({ id: "createaddition:rolling/straw" })
})
