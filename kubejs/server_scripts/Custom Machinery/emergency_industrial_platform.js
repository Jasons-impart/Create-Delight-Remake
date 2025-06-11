const Platform1 = {
    "type": "custommachinery:command",
    "phase": "crafting_tickable",
    "command": "/playsound minecraft:block.stone.place block @a ~ ~ ~ 0.5",
    "log": false,
    "chance": 0.25,
    "permissionlevel": 5
}
const Platform2 = {
    "type": "custommachinery:command",
    "phase": "crafting_tickable",
    "command": "/particle minecraft:snowflake ~ ~1 ~ 0.3 1.5 0.3 0 5",
    "log": false,
    "permissionlevel": 5
}
const Platform3 = {
    "type": "custommachinery:command",
    "phase": "crafting_tickable",
    "command": "/particle minecraft:cloud ~ ~1 ~ 0.55 1 0.55 0 4",
    "log": false,
    "permissionlevel": 5
}
const PlatformCommon = {
    "type": "custommachinery:command",
    "phase": "crafting_tickable",
    "command": "/function createdelight:check_particle",
    "log": false,
    "chance": 0.05,
    "permissionlevel": 5
}
const PlatformFill0 = {
    "type": "custommachinery:command",
    "phase": "ending",
    "command": "/function createdelight:check/direction_0",
    "log": false,
    "permissionlevel": 5
}
const PlatformFill1 = {
    "type": "custommachinery:command",
    "phase": "ending",
    "command": "/function createdelight:check/direction_1",
    "log": false,
    "permissionlevel": 5
}
const PlatformFill2 = {
    "type": "custommachinery:command",
    "phase": "ending",
    "command": "/function createdelight:check/direction_2",
    "log": false,
    "permissionlevel": 5
}
const PlatformFill3 = {
    "type": "custommachinery:command",
    "phase": "ending",
    "command": "/function createdelight:check/direction_3",
    "log": false,
    "permissionlevel": 5
}
const PlatformFill4 = {
    "type": "custommachinery:command",
    "phase": "ending",
    "command": "/function createdelight:check/direction_4",
    "log": false,
    "permissionlevel": 5
}
const PlatformHeight = {
    "type": "custommachinery:position",
    "y": "(-59,)"
}
ServerEvents.recipes(e => {
    function SetPlatform(platformMachineId, platformFunction) {
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 5,
            "error": false,
            "hidden": true,
            "priority": 0,
            "requirements": [
                PlatformHeight,
                PlatformCommon
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/common")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 6,
            "requirements": [
                {
                    "type": "custommachinery:command",
                    "phase": "ending",
                    "command": "function " + platformFunction,
                    "log": false,
                    "permissionlevel": 5
                },
                PlatformCommon,
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "input",
                    "tank": "tank4",
                    "fluid": "create:chocolate",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 5,
            "requirements": [
                PlatformFill4,
                PlatformCommon,
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "input",
                    "tank": "tank3",
                    "fluid": "minecraft:milk",
                    "amount": 100
                },
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank4",
                    "fluid": "create:chocolate",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set1")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 4,
            "requirements": [
                PlatformFill3,
                PlatformCommon,
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "input",
                    "tank": "tank2",
                    "fluid": "create:honey",
                    "amount": 100
                },
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank3",
                    "fluid": "minecraft:milk",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set2")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 3,
            "requirements": [
                PlatformCommon,
                PlatformFill2,
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "input",
                    "tank": "tank1",
                    "fluid": "minecraft:water",
                    "amount": 100
                },
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank2",
                    "fluid": "create:honey",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set3")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 2,
            "requirements": [
                PlatformCommon,
                PlatformFill1,
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "input",
                    "tank": "tank",
                    "fluid": "minecraft:lava",
                    "amount": 100
                },
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank1",
                    "fluid": "minecraft:water",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set4")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 1,
            "requirements": [
                PlatformHeight,
                PlatformCommon,
                PlatformFill0,
                Platform1,
                Platform2,
                {
                    "type": "custommachinery:item",
                    "mode": "input",
                    "item": "minecraft:stone",
                    "amount": 1
                },
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank",
                    "fluid": "minecraft:lava",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set5")
        e.custom({
            "type": "custommachinery:custom_machine",
            "machine": platformMachineId,
            "time": 20,
            "error": false,
            "hidden": true,
            "priority": 1,
            "requirements": [
                PlatformHeight,
                PlatformCommon,
                PlatformFill0,
                {
                    "type": "custommachinery:drop",
                    "mode": "input",
                    "action": "consume",
                    "radius": 2,
                    "input": ["minecraft:stone"]
                },
                Platform1,
                Platform2,
                Platform3,
                {
                    "type": "custommachinery:fluid",
                    "mode": "output",
                    "tank": "tank",
                    "fluid": "minecraft:lava",
                    "amount": 100
                }
            ]
        }).id("createdelight:" + platformMachineId.split(":")[1] + "/set6")
    }
    SetPlatform("createdelight:emergency_industrial_platform", "createdelight:setplatform")
    SetPlatform("createdelight:emergency_industrial_platform_block", "createdelight:setplatform_block")
    SetPlatform("createdelight:emergency_industrial_platform_dark", "createdelight:setplatform_dark")
    SetPlatform("createdelight:emergency_industrial_platform_dark_block", "createdelight:setplatform_dark_block")
    SetPlatform("createdelight:emergency_industrial_platform_lime", "createdelight:setplatform_lime")
    SetPlatform("createdelight:emergency_industrial_platform_lime_block", "createdelight:setplatform_lime_block")
})
