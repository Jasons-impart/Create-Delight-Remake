// Credit to 史莱姆li
// 还有client部分代码，见 client/network.js
let $Boolean = Java.loadClass("java.lang.Boolean")
const beltCasing = ["create:brass_casing", "create:andesite_casing"]

const shaftCasingType = { "create:brass_casing": "create:brass_encased_shaft", "create:andesite_casing": "create:andesite_encased_shaft" }
const beltCasingType = { "create:brass_casing": "BRASS", "create:andesite_casing": "ANDESITE" }
const inversedBeltCasingType = { "BRASS": "create:brass_casing", "ANDESITE": "create:andesite_casing" }

NetworkEvents.dataReceived("isPlayerAltDown", event => {
    event.player.persistentData.Alt = event.data.Alt
    if (beltCasing.some(i => i == event.player.mainHandItem.id) && event.data.Alt == true) {
        event.player.setStatusMessage(Text.translate("message.kubejs.chainedcasing"))
    }
    if ("create:wrench" == event.player.mainHandItem.id && event.data.Alt == true) {
        event.player.setStatusMessage(Text.translate("message.kubejs.chaineduncasing"))
    }
})

let $BeltBlock = Java.loadClass("com.simibubi.create.content.kinetics.belt.BeltBlock")
//传送带连锁套壳
BlockEvents.rightClicked("create:belt", event => {
    if (event.player == null) { return }
    if (event.player.isShiftKeyDown()) { return }
    if (event.player.persistentData.Alt == false) { return }
    if (beltCasing.some(i => i == event.item.id)) {
        event.player.swing()
        let limit = 32

        let block = event.block
        let BlockStates = block.blockState
        let part = BlockStates.getValue($BeltBlock.PART).toString()

        let HorizontalFacing = BlockStates.getValue($BeltBlock.HORIZONTAL_FACING).toString()
        let Slope = BlockStates.getValue($BeltBlock.SLOPE).toString()
        let YAxis = false//水平传送带还是斜传送带
        let toEndblock = block
        let toEndBlockStates = toEndblock.blockState
        let toEndPos = [0, 0, 0]
        let toEndVec = [0, 0, 0]
        let toStartblock = block
        let toStartBlockStates = toStartblock.blockState
        let toStartPos = [0, 0, 0]
        let toStartVec = [0, 0, 0]
        //套？拆？
        let encaseOrNot = true
        //let encaseOrNot = !Boolean(BlockStates.getValue($BeltBlock.CASING).toString())
        //encaseOrNot = encaseOrNot || !(event.item.id == inversedBeltCasingType[block.entityData.Casing])
        //event.player.tell(encaseOrNot)
        switch (HorizontalFacing) {
            case 'east':
                toEndVec[0] = 1
                toStartVec[0] = -1
                break
            case 'west':
                toEndVec[0] = -1
                toStartVec[0] = 1
                break
            case 'south':
                toEndVec[2] = 1
                toStartVec[2] = -1
                break
            case 'north':
                toEndVec[2] = -1
                toStartVec[2] = 1
                break
        }
        if (Slope != 'HORIZONTAL') { YAxis = true }
        if (YAxis) {
            switch (Slope) {
                case 'UPWARD':
                    toEndVec[1] = 1
                    toStartVec[1] = -1
                    break
                case 'DOWNWARD':
                    toEndVec[1] = -1
                    toStartVec[1] = 1
                    break
            }
        }
        //遍历至末端
        if (part != 'END') {
            for (let i = 0; i < limit; i++) {
                toEndPos[0] += toEndVec[0]
                toEndPos[1] += toEndVec[1]
                toEndPos[2] += toEndVec[2]
                toEndblock = block.offset(toEndPos[0], toEndPos[1], toEndPos[2])
                if (toEndblock.id != 'create:belt') { break }
                toEndBlockStates = toEndblock.blockState
                //event.player.tell(toEndblock.pos)
                event.level.setBlockAndUpdate(toEndblock.pos, toEndBlockStates.setValue($BeltBlock.CASING, encaseOrNot ? $Boolean.TRUE : $Boolean.FALSE))
                event.level.server.runCommandSilent(`/data modify block ${toEndblock.pos.x} ${toEndblock.pos.y} ${toEndblock.pos.z} Casing set value "${encaseOrNot ? beltCasingType[event.item.id] : 'NONE'}"`)
                //event.level.blockEntityChanged(toEndPos[0]+block.pos.x,toEndPos[1]+block.pos.y,toEndPos[2]+block.pos.z)
                //是否继续
                if (toEndBlockStates.getValue($BeltBlock.PART).toString() == 'END') {
                    break
                }
            }
        }
        //遍历至起始端
        if (part != 'START') {
            for (let i = 0; i < limit; i++) {
                toStartPos[0] += toStartVec[0]
                toStartPos[1] += toStartVec[1]
                toStartPos[2] += toStartVec[2]
                toStartblock = block.offset(toStartPos[0], toStartPos[1], toStartPos[2])
                if (toStartblock.id != 'create:belt') { break }
                toStartBlockStates = toStartblock.blockState
                event.level.setBlockAndUpdate(toStartblock.pos, toStartBlockStates.setValue($BeltBlock.CASING, encaseOrNot ? $Boolean.TRUE : $Boolean.FALSE))
                event.level.server.runCommandSilent(`/data modify block ${toStartblock.pos.x} ${toStartblock.pos.y} ${toStartblock.pos.z} Casing set value "${encaseOrNot ? beltCasingType[event.item.id] : 'NONE'}"`)
                //是否继续
                if (toStartBlockStates.getValue($BeltBlock.PART).toString() == 'START') {
                    break
                }
            }
        }
    }
})
let $ShaftBlock = Java.loadClass("com.simibubi.create.content.kinetics.simpleRelays.ShaftBlock")
//传动杆连锁套壳
BlockEvents.rightClicked("create:shaft", event => {
    if (event.player == null) { return }
    if (event.player.isShiftKeyDown()) { return }
    if (event.player.persistentData.Alt == false) { return }
    if (beltCasing.some(i => i == event.item.id)) {
        event.player.swing()
        let limit = 64

        let block = event.block
        let BlockStates = block.blockState
        let Axis = BlockStates.getValue($ShaftBlock.AXIS).toString()

        let toEndblock = block
        let toEndBlockStates = 0
        let toEndPos = [0, 0, 0]
        let toEndVec = [0, 0, 0]
        let toStartblock = block
        let toStartBlockStates = 0
        let toStartPos = [0, 0, 0]
        let toStartVec = [0, 0, 0]
        switch (Axis) {
            case 'x':
                toEndVec[0] = 1
                toStartVec[0] = -1
                break
            case 'y':
                toEndVec[1] = 1
                toStartVec[1] = -1
                break
            case 'z':
                toEndVec[2] = 1
                toStartVec[2] = -1
                break
        }
        //遍历至末端
        for (let i = 0; i < limit; i++) {
            toEndPos[0] += toEndVec[0]
            toEndPos[1] += toEndVec[1]
            toEndPos[2] += toEndVec[2]
            toEndblock = block.offset(toEndPos[0], toEndPos[1], toEndPos[2])
            if (toEndblock.id != 'create:shaft' && toEndblock.id != shaftCasingType[event.item.id]) {
                break
            }
            toEndBlockStates = toEndblock.blockState
            if (toEndBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) {
                break
            }
            event.level.server.runCommandSilent(`/setblock ${toEndblock.pos.x} ${toEndblock.pos.y} ${toEndblock.pos.z} ${shaftCasingType[event.item.id]}[axis=${Axis.toLowerCase()}]`)
        }

        //遍历至起始端
        for (let i = 0; i < limit; i++) {
            toStartPos[0] += toStartVec[0]
            toStartPos[1] += toStartVec[1]
            toStartPos[2] += toStartVec[2]
            toStartblock = block.offset(toStartPos[0], toStartPos[1], toStartPos[2])
            if (toStartblock.id != 'create:shaft' && toStartblock.id != shaftCasingType[event.item.id]) { break }
            toStartBlockStates = toStartblock.blockState
            if (toStartBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) { break }
            event.level.server.runCommandSilent(`/setblock ${toStartblock.pos.x} ${toStartblock.pos.y} ${toStartblock.pos.z} ${shaftCasingType[event.item.id]}[axis=${Axis.toLowerCase()}]`)
        }

    }
})
//传动杆连锁拆壳
BlockEvents.rightClicked("create:brass_encased_shaft", event => {
    if (event.player == null) { return }
    if (!event.player.isShiftKeyDown()) { return }
    if (event.item.id != "create:wrench") { return }
    if (event.player.persistentData.Alt == false) { return }
    event.player.swing()
    let limit = 64

    let block = event.block
    let BlockStates = block.blockState
    let Axis = BlockStates.getValue($ShaftBlock.AXIS).toString()

    let toEndblock = block
    let toEndBlockStates = 0
    let toEndPos = [0, 0, 0]
    let toEndVec = [0, 0, 0]
    let toStartblock = block
    let toStartBlockStates = 0
    let toStartPos = [0, 0, 0]
    let toStartVec = [0, 0, 0]
    switch (Axis.toString()) {
        case 'x':
            toEndVec[0] = 1
            toStartVec[0] = -1
            break
        case 'y':
            toEndVec[1] = 1
            toStartVec[1] = -1
            break
        case 'z':
            toEndVec[2] = 1
            toStartVec[2] = -1
            break
    }
    //遍历至末端
    for (let i = 0; i < limit; i++) {
        toEndPos[0] += toEndVec[0]
        toEndPos[1] += toEndVec[1]
        toEndPos[2] += toEndVec[2]
        toEndblock = block.offset(toEndPos[0], toEndPos[1], toEndPos[2])
        if (toEndblock.id != "create:brass_encased_shaft") {
            break
        }
        toEndBlockStates = toEndblock.blockState
        if (toEndBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) {
            break
        }
        event.level.server.runCommandSilent(`/setblock ${toEndblock.pos.x} ${toEndblock.pos.y} ${toEndblock.pos.z} create:shaft[axis=${Axis.toLowerCase()}]`)
    }
    //遍历至起始端
    for (let i = 0; i < limit; i++) {
        toStartPos[0] += toStartVec[0]
        toStartPos[1] += toStartVec[1]
        toStartPos[2] += toStartVec[2]
        toStartblock = block.offset(toStartPos[0], toStartPos[1], toStartPos[2])
        if (toStartblock.id != "create:brass_encased_shaft") { break }
        toStartBlockStates = toStartblock.blockState
        if (toStartBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) { break }
        event.level.server.runCommandSilent(`/setblock ${toStartblock.pos.x} ${toStartblock.pos.y} ${toStartblock.pos.z} create:shaft[axis=${Axis.toLowerCase()}]`)
    }
})
BlockEvents.rightClicked("create:andesite_encased_shaft", event => {
    if (event.player == null) { return }
    if (!event.player.isShiftKeyDown()) { return }
    if (event.item.id != "create:wrench") { return }
    if (event.player.persistentData.Alt == false) { return }
    event.player.swing()
    let limit = 64

    let block = event.block
    let BlockStates = block.blockState
    let Axis = BlockStates.getValue($ShaftBlock.AXIS).toString()

    let toEndblock = block
    let toEndBlockStates = 0
    let toEndPos = [0, 0, 0]
    let toEndVec = [0, 0, 0]
    let toStartblock = block
    let toStartBlockStates = 0
    let toStartPos = [0, 0, 0]
    let toStartVec = [0, 0, 0]
    switch (Axis.toString()) {
        case 'x':
            toEndVec[0] = 1
            toStartVec[0] = -1
            break
        case 'y':
            toEndVec[1] = 1
            toStartVec[1] = -1
            break
        case 'z':
            toEndVec[2] = 1
            toStartVec[2] = -1
            break
    }
    //遍历至末端
    for (let i = 0; i < limit; i++) {
        toEndPos[0] += toEndVec[0]
        toEndPos[1] += toEndVec[1]
        toEndPos[2] += toEndVec[2]
        toEndblock = block.offset(toEndPos[0], toEndPos[1], toEndPos[2])
        if (toEndblock.id != "create:andesite_encased_shaft") {
            break
        }
        toEndBlockStates = toEndblock.blockState
        if (toEndBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) {
            break
        }
        event.level.server.runCommandSilent(`/setblock ${toEndblock.pos.x} ${toEndblock.pos.y} ${toEndblock.pos.z} create:shaft[axis=${Axis.toLowerCase()}]`)
    }
    //遍历至起始端
    for (let i = 0; i < limit; i++) {
        toStartPos[0] += toStartVec[0]
        toStartPos[1] += toStartVec[1]
        toStartPos[2] += toStartVec[2]
        toStartblock = block.offset(toStartPos[0], toStartPos[1], toStartPos[2])
        if (toStartblock.id != "create:andesite_encased_shaft") { break }
        toStartBlockStates = toStartblock.blockState
        if (toStartBlockStates.getValue($ShaftBlock.AXIS).toString() != Axis) { break }
        event.level.server.runCommandSilent(`/setblock ${toStartblock.pos.x} ${toStartblock.pos.y} ${toStartblock.pos.z} create:shaft[axis=${Axis.toLowerCase()}]`)
    }
})