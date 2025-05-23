//依然参考忆然（？）


let tetra_item = ['tetra:modular_sword', 'tetra:modular_double', 'tetra:modular_bow', 'tetra:modular_shield', 'tetra:modular_crossbow', 'tetra:modular_single']
RenderJSEvents.RegisterItemDecorations(e => {

    tetra_item.forEach(id => {
        e.register(id, 'energy', c => {
            if(!c.itemStack.nbt) return
            let dx = 0, dy = -2
            RenderJSRenderSystem.setShaderColorJS(1,1,1,1)
            RenderJSRenderSystem.disableDepthTestJS()
            let MaxEnergy = c.itemStack.nbt.getInt('maxEnergy')
            if (MaxEnergy > 0) {
                let Energy = c.itemStack.nbt.getInt('energy')
                c.pushPose()
                c.translate(c.xOffset + 2, c.yOffset + 13, 200)
                c.fill(dx, dy, dx + 13, dy + 2, 0, 0, 0, 255)
                c.translate(0,0,1)
                c.fill(dx, dy, dx + Energy / MaxEnergy * 13, dy + 1, 240, 63, 60, 255)
                c.popPose()
            }
        })
    })
})