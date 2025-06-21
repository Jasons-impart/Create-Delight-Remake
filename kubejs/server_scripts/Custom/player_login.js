
PlayerEvents.loggedIn(e => {
    const {level, player} = e
    let donate_list = JsonIO.read("donate_list.json")
    if (player.persistentData.get("notFirstLogin") == null) {
        player.give("ftbquests:book")
        player.persistentData.putBoolean("notFirstLogin", true)
        let name = player.name.getString()
        let title = donate_list.get(name)
        if (title != null) {
            level.runCommandSilent(`/ftbranks create ${name}`)
            level.runCommandSilent(`/ftbranks add ${name} ${name.toLowerCase()}`)
            level.runCommandSilent(`/ftbranks node add ${name.toLowerCase()} ftbranks.name_format [${title}]{name}`)
        }
    }
})
