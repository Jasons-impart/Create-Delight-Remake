ServerEvents.tags("minecraft:item", e => {
    e.add("mynethersdelight:ghast_meats", 
        "dungeonsdelight:ghast_tentacle",
        "dungeonsdelight:ghast_calamari"
    )
    e.removeAllTagsFrom([
        "mynethersdelight:hoglin_sausage",
        "mynethersdelight:roasted_sausage",
        'mynethersdelight:slices_of_bread',
        'mynethersdelight:toasts'
    ])
    e.add("forge:vines/nether", [
        "minecraft:weeping_vines",
        "minecraft:twisting_vines",
        'netherexp:weeping_ivy',
        'netherexp:twisting_ivy'
    ])
})