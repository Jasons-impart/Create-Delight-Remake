ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:raw_hotdog", [
        'hotdog_delight:cod_hotdog',
        'hotdog_delight:salmon_hotdog',
        'hotdog_delight:pork_hotdog',
        'hotdog_delight:squid_ink_hotdog',
        'hotdog_delight:glow_ink_hotdog',
        'hotdog_delight:pumpkin_hotdog'])
    e.add("createdelight:cooked_hotdog", [
        'hotdog_delight:cooked_pork_hotdog',
        'hotdog_delight:cooked_cod_hotdog',
        'hotdog_delight:cooked_salmon_hotdog'])
})