const $Lighting = Java.loadClass("com.mojang.blaze3d.platform.Lighting")
RenderJSEvents.RegisterItemDecorations(e => {
    e.register("expatternprovider:infinity_cell", c => {
        if(!c.itemStack.nbt) return
        let record = c.itemStack.nbt.getCompound("record")
        let type = record.getString("#c")
        let id = record.getString("id")
        c.pushPose()
        c.translate(c.xOffset + 8, c.yOffset + 7, 10)
        c.scale(0.65, 0.65)
        $Lighting.setupForFlatItems()
        if (type == "ae2:i") {
            c.renderGuiItem(Item.of(id), 0, 0)
        }
        else if (type == "ae2:f") {
            c.renderGuiItem(Fluid.of(id).fluid.bucket.defaultInstance, 0, 0)
        }
        $Lighting.setupFor3DItems()
        c.popPose()
    })
})
