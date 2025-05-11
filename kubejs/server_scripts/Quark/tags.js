ServerEvents.tags("item", e => {
    e.remove("curios:belt", [
        "quark:paper_lantern",
        "quark:paper_lantern_sakura"
    ])
    e.removeAllTagsFrom([
        'quark:potato_crate'
    ])
})