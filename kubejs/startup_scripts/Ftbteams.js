ForgeEvents.onEvent('net.minecraftforge.client.event.ClientChatReceivedEvent', e => {
    if (String(e.message).match("ftb")){
    console.log(String(e.message))
    if(String(e.message).match("invited")){
    var regex1 = /\/ftbteams\sinfo\s(\w+#\w+)/;
    var match1 = regex1.exec(e.message);
    var regex2 = /args=\[literal\{(\w+)\}/;
    var match2 = regex2.exec(e.message);
    var ftbteam={};
    ftbteam[match2[1]] = match1[1];
    Utils.server.persistentData.PlayerFTB=ftbteam
    }
    e.setCanceled(true)
    }
    })