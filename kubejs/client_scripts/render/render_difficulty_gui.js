let Difficulty = {}

const improvedMobs$CapabilityProvider = Java.loadClass("io.github.flemmli97.improvedmobs.forge.capability.CapabilityProvider")

/**
 * 
 * @param {Internal.LocalPlayer} player
 * @returns {number}
 */
Difficulty.getPlayerRawValue = function () {
    return global.difficultyCache
}

Difficulty.getPlayerTier = function () {
    for (let index = 0; index < this.tierThreshold.length; index++) {
        if (this.getPlayerRawValue() <= this.tierThreshold[index])
            return index
    }
    return this.tierThreshold.length
}

Difficulty.getPlayerCurrentProcess = function () {
    let tier = Difficulty.getPlayerTier()
    let rawValue = Difficulty.getPlayerRawValue()
    if (tier != this.tierThreshold.length) {
        return (rawValue - this.tierThreshold[tier - 1]) / (this.tierThreshold[tier] - this.tierThreshold[tier - 1])
    }
    else
        return 1
}

Difficulty.tierThreshold = [0, 100, 200, 300, 450, 600]

RenderJSEvents.onGuiPreRender(e => {
    let location = "createdelight:textures/gui/difficulty_progress_bar"
    let textureWidth = 8, textureHeight = 32
    let windowWidth = e.window.guiScaledWidth
    let windowHeight = e.window.guiScaledHeight
    let tierColor = [[173, 216, 230], [204, 255, 204], [255, 204, 77], [255, 153, 153], [255, 128, 128]]
    let tier = Difficulty.getPlayerTier()
    let process = Difficulty.getPlayerCurrentProcess()
    let rawValue = Difficulty.getPlayerRawValue()
    // Client.tell(`${tier}, ${process}, ${rawValue}`)

    e.translate(windowWidth * 0.02, windowHeight * 0.5)
    e.mulPose(new Quaternionf().rotateZ(JavaMath.PI))
    e.pushPose()
    e.drawTexture(`${location}_under.png`, -textureWidth / 2, 0, textureWidth, textureHeight, 0, textureHeight, textureWidth, textureHeight)
    e.drawTexture(`${location}_over.png`, -textureWidth / 2, 0, textureWidth, textureHeight, 0, textureHeight, textureWidth, textureHeight)
    e.popPose()
    for (let index = 0; index < tier - 1; index++) {
        e.pushPose()
        e.guiGraphics.setColor(tierColor[index][0] / 255, tierColor[index][1] / 255, tierColor[index][2] / 255, 1)
        e.drawTexture(`${location}.png`, -textureWidth / 2, 0, textureWidth, textureHeight, 0, textureHeight, textureWidth, textureHeight)
        e.popPose()
    }
    if (tier != Difficulty.tierThreshold.length) {
        e.guiGraphics.setColor(tierColor[tier - 1][0] / 255, tierColor[tier - 1][1] / 255, tierColor[tier - 1][2] / 255, 1)
        e.pushPose()
        e.drawTexture(`${location}.png`, -textureWidth / 2, 0, textureWidth, textureHeight, 0, textureHeight, textureWidth, textureHeight * process)
        e.popPose()
    }
})