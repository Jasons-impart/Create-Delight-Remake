function checkTeamData() {
  if (!Utils.server.persistentData.TeamList) {
    Utils.server.persistentData.TeamList = {};
  }
}
 
function readTeams() {
  checkTeamData();
  return Utils.server.persistentData.TeamList;
}
 
function writeTeams(teams) {
  Utils.server.persistentData.TeamList = teams;
}
 
function getTeamByPlayer(player) {
  var teams = readTeams();
  return Object.values(teams).find(team => team.leader === player || String(team.member).includes(player) ) || null;
}
 
function createTeam(teamName, leader) {
  if (!teamName) return false;
 
  var teams = readTeams();
  if (getTeamByPlayer(leader)) return false;
 
  if (!teams[teamName]) {
    teams[teamName] = {
      name: teamName,
      leader: leader,
      member: [],
      createTime: new Date().toISOString()
    };
    writeTeams(teams);
    return true;
  }
  return false;
}
 
function leaveTeam(player) {
  var teams = readTeams();
  var playerTeam = getTeamByPlayer(player);
  if (playerTeam) {
    if (player === playerTeam.leader) {
      delete teams[playerTeam.name];
    } else {
      teams[playerTeam.name].member = teams[playerTeam.name].member.filter(member => member !== player);
    }
    writeTeams(teams);
    return true;
  }
  return false;
}
 
function kickFromTeam(leader, playerToKick) {
  var teams = readTeams();
  var leaderTeam = getTeamByPlayer(leader);
 
  if (leaderTeam && leader === leaderTeam.leader && String(leaderTeam.member).includes(playerToKick)) {
    teams[leaderTeam.name].member = teams[leaderTeam.name].member.filter(member => member !== playerToKick);
    writeTeams(teams);
    return true;
  }
  return false;
}
 
function getTeamInfo(teamName) {
  return readTeams()[teamName] || null;
}
 
function joinTeam(teamName, player) {
  var teams = readTeams();
  if (getTeamByPlayer(player) || !teams[teamName]) return false;
 
  var invitedPlayers = teams[teamName].invitedPlayers || [];
  if (!invitedPlayers.indexOf(player)) {
    Utils.server.runCommandSilent(`tellraw ${teams[teamName].leader} [{"text":"[Teams]玩家 ${player} 请求加入队伍，接受请点击 ","color":"yellow"}, {"text":"【此处】","color":"green","clickEvent":{"action":"run_command","value":"/teams invite '${player}'"},"hoverEvent":{"action":"show_text","value":"接受请求"}}]`);
    return false;
  } else {
    teams[teamName].member.push(player);
    teams[teamName].invitedPlayers = invitedPlayers.filter(invitedPlayer => invitedPlayer !== player);
    writeTeams(teams);
    return true;
  }
}
 
function inviteToTeam(leader, playerToInvite) {
  var teams = readTeams();
  var leaderTeam = getTeamByPlayer(leader);
 
  if (leaderTeam && leader === leaderTeam.leader) {
    var teamName = leaderTeam.name;
    var invitedPlayers = teams[teamName].invitedPlayers || [];
      invitedPlayers.push(playerToInvite);
      teams[teamName].invitedPlayers = invitedPlayers;
      writeTeams(teams);
      Utils.server.runCommandSilent(`tellraw ${playerToInvite}  [{"text":"[Teams]您已被队长邀请加入队伍 ${teamName} ，接受请点击 ","color":"yellow"}, {"text":"【此处】","color":"green","clickEvent":{"action":"run_command","value":"/teams join"},"hoverEvent":{"action":"show_text","value":"加入队伍 ${teamName}"}}]`);
      
      setInterval(() => {
        var updatedTeams = readTeams();
        let result = Object.values(updatedTeams).find(team => String(team.member).includes(playerToInvite)) || "null";
        if (result == "null") {
            updatedTeams[teamName].invitedPlayers = updatedTeams[teamName].invitedPlayers.filter(invitedPlayer => invitedPlayer !== playerToInvite);
            writeTeams(updatedTeams);
            Utils.server.runCommandSilent(`tellraw ${playerToInvite} {"text":"[Teams]您未及时接受队伍邀请，邀请已取消。","color":"green"}`);
            Utils.server.runCommandSilent(`tellraw ${leader} {"text":"[Teams]玩家 ${playerToInvite} 未及时接受邀请，邀请已取消。","color":"green"}`);
            
            // 取消 setInterval
 
        }
        clearInterval();
    }, 120000);
      return true;
  }
  return false;
}
 
// Command registration
ServerEvents.commandRegistry(event => {
  var { commands: Commands, arguments: Arguments } = event;
  event.register(
    Commands.literal("teams")
    .executes(ctx=>{
      var player = ctx.source.playerOrException;
      var server = ctx.source.server;
      var playerName = player.getName().getString();
<<<<<<< HEAD
      server.runCommandSilent(`tellraw ${playerName} {"text":"========齿轮盛宴组队系统========","color":"yellow"}`);
=======
      server.runCommandSilent(`tellraw ${playerName} {"text":"========组队系统========","color":"yellow"}`);
>>>>>>> 122ddfe74cb17307a9ee411298fc2eba29fb037a
      server.runCommandSilent(`tellraw ${playerName} [{"text":"【创建队伍】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams create"},"hoverEvent":{"action":"show_text","value":"创建队伍"}}, {"text":"        ","color":"yellow"}, {"text":"【查看队伍】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams info self"},"hoverEvent":{"action":"show_text","value":"查看当前队伍信息"}}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"【邀请玩家】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams invite"},"hoverEvent":{"action":"show_text","value":"邀请玩家加入队伍"}}, {"text":"        ","color":"yellow"}, {"text":"【踢出玩家】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams kick"},"hoverEvent":{"action":"show_text","value":"从队伍中踢出玩家"}}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"【队伍列表】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams list"},"hoverEvent":{"action":"show_text","value":"查看所有队伍"}}, {"text":"        ","color":"yellow"}, {"text":"【离开队伍】","color":"yellow","clickEvent":{"action":"run_command","value":"/teams leave"},"hoverEvent":{"action":"show_text","value":"退出队伍"}}]`);
      return 1;
    }
    )
    .then(Commands.literal("help")
    .executes(ctx => {
      var player = ctx.source.playerOrException;
      var server = ctx.source.server;
      if (player == null){
        console.log("[Teams] /teams - 打开组队面板")
        console.log("[Teams] /teams help - 查看指令帮助")
        console.log("[Teams] /teams list - 查看队伍列表")
        console.log("[Teams] /teams join - 加入队伍")
        console.log("[Teams] /teams leave - 离开/解散队伍")
        console.log("[Teams] /teams info <name> - 查看队伍信息")
        console.log("[Teams] /teams kick <name> - 踢出玩家（名称可不填）")
        console.log("[Teams] /teams invite <name> - 邀请玩家（名称可不填）")
        console.log("[Teams] /teams create <name> - 创建队伍（名称可不填）")
        return 1;
      }else{
      var playerName = player.getName().getString();
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams - 打开组队面板","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams help - 查看指令帮助","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams list - 查看队伍列表","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams join - 加入队伍","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams leave - 离开/解散队伍","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams info <name> - 查看队伍信息","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams kick <name> - 踢出玩家（名称可不填）","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams invite <name> - 邀请玩家（名称可不填）","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" /teams create <name> - 创建队伍（名称可不填）","color":"yellow"}]`);
      server.runCommandSilent(`tellraw ${playerName} [{"text":"[Teams]","color":"green"}, {"text":" Powered By Kubejs - Code Author:Rin_Schariac","color":"gray"}]`);
      return 1;
      }
    }
  ))
      .then(Commands.literal('create')
        .then(Commands.argument('name', Arguments.STRING.create(event))
          .executes(ctx => {
            var name = Arguments.STRING.getResult(ctx, "name");
            var player = ctx.source.playerOrException;
            var server = ctx.source.server;
            var playerName = player.getName().getString();
 
            if (!player) {
              console.log("[Teams]请勿在控制台创建队伍")
              return 0;
            }
            if (getTeamByPlayer(playerName)){
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]你已拥有一个队伍","color":"green"}`);
            return 0;
            }
            if(!isNaN(name)){
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]创建队伍失败，请勿使用纯数字名称！","color":"green"}`);
              return 0;
            }
            if (name=="self"){
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]创建队伍失败，请尝试更换名称后再次创建","color":"green"}`);
              return 0;
            }
            if (createTeam(name, playerName)) {
              player.runCommandSilent(`ftbteams party create ${name}`)
              player.runCommandSilent(`mine_and_slash teams create`)
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]成功创建队伍 ${name} ，聊天开头添加 ! 标识可队内聊天！"}`);
              player.persistentData.TeamCreate="False"
              return 1;
            }else{
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]创建队伍失败","color":"green"}`);
              return 0;
            }
          })
        )
        .executes(ctx=>{
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
          player.persistentData.TeamCreate="True"
          server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]请输入队伍名称（输入 “T” 取消创建）：","color":"yellow"}`);
          return 1;
        })
      )
      .then(Commands.literal("list")
        .executes(ctx => {
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
 
          var teams = readTeams();
          var teamList = Object.keys(teams);
 
          server.runCommandSilent(`tellraw ${playerName} {"text":"队伍列表：","color":"yellow"}`);
          teamList.forEach((team, index) => {
            server.runCommandSilent(`tellraw ${playerName} {"text":"${index + 1}. ${team}","color":"yellow","clickEvent":{"action":"run_command","value":"/teams info '${team}'"},"hoverEvent":{"action":"show_text","value":"查看 ${team} 信息"}}`);
          });
          return 1;
        })
      )
      .then(Commands.literal("info")
        .then(Commands.argument("name", Arguments.STRING.create(event))
          .executes(ctx => {
            let name = Arguments.STRING.getResult(ctx, "name");
            var player = ctx.source.playerOrException;
            var server = ctx.source.server;
            var playerName = player.getName().getString();
            var teams = readTeams();
            if (!name || name=="self") {
              var playerTeam = getTeamByPlayer(playerName);
              if (playerTeam) {
                name = playerTeam.name;
              } else {
                server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]您不在任何队伍中","color":"green"}`);
                return 0;
              }
            }            
            var teamInfo = getTeamInfo(name);
            var member=[]
            if (teamInfo) {
              teamInfo.member.forEach(e=>{
                member = String(e).slice(1,-1) +","+ member
              })
              server.runCommandSilent(`tellraw ${playerName} {"text":"========队伍信息========"}`);
              server.runCommandSilent(`tellraw ${playerName} {"text":"队伍名称: ${teamInfo.name}"}`);
              server.runCommandSilent(`tellraw ${playerName} {"text":"队长: ${teamInfo.leader}"}`);
              server.runCommandSilent(`tellraw ${playerName} {"text":"队员: ${member}"}`);
              server.runCommandSilent(`tellraw ${playerName} {"text":"创建时间: ${teamInfo.createTime}"}`);
              return 1;
            } else {
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]队伍不存在","color":"green"}`);
              return 0;
            }
          })
        )
        .executes(ctx => {
          var player = ctx.source.playerOrException;
          player.runCommandSilent("teams info self")
          return 1;
        }
      )
      )
      .then(Commands.literal("leave")
        .executes(ctx => {
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
 
          if (leaveTeam(playerName)) {
            player.runCommandSilent(`mine_and_slash teams leave`)
            player.runCommandSilent(`ftbteams party leave`)
            server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]离开队伍成功","color":"green"}`);
            return 1;
          } else {
            server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]您不在任何队伍中","color":"green"}`);
            return 0;
          }
        })
      )
      .then(Commands.literal('invite')
        .then(Commands.argument('name', Arguments.STRING.create(event))
          .executes(ctx => {
            var name = Arguments.STRING.getResult(ctx, "name");
            var player = ctx.source.playerOrException;
            var server = ctx.source.server;
            var playerName = player.getName().getString();
            var playerTeam = getTeamByPlayer(name)
            var targetPlayer = server.playerList.getPlayerByName(name);
            if (!targetPlayer) {
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]玩家不在线","color":"green"}`);
              return 0;
            }
            if (!playerTeam && inviteToTeam(playerName, name)) {
              player.runCommandSilent(`mine_and_slash teams invite ${name}`)
              player.runCommandSilent(`ftbteams party invite ${name}`)
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]邀请已发送","color":"green"}`);
              return 1;
            } else {
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]邀请发送失败","color":"green"}`);
              return 0;
            }
          })
        )
        .executes(ctx=>{
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
          var list= server.playerList.getPlayers()
          var playerNames = list.toString().match(/ServerPlayer\['([^']+)'/g).map(match => match.slice(14, -1));
          var playerTeam = getTeamByPlayer(playerName);
          if (playerTeam) {
            server.runCommandSilent(`tellraw ${playerName} {"text":"======当前玩家列表======","color":"yellow"}`);
            let cont=""
            let count=0
            playerNames.forEach(name=>{
              if (playerTeam = getTeamByPlayer(name)){
                return;
              }
              if (count < 4){
                if (cont == ""){
                  cont = `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams invite '${name}'"},"hoverEvent":{"action":"show_text","value":"邀请 ${name}"}}`
                  } else {
                      cont = cont +","+ `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams invite '${name}'"},"hoverEvent":{"action":"show_text","value":"邀请 ${name}"}}`
                  }
                  count++;
                } else {
                    cont = cont +","+ `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams invite '${name}'"},"hoverEvent":{"action":"show_text","value":"邀请 ${name}"}}`
                    server.runCommandSilent(`tellraw ${playerName} [${cont}]`)
                    count = 0
                    cont=""
                }
              })
              server.runCommandSilent(`tellraw ${playerName} [${cont}]`)
              return 1;
            }
            return 0;
        })
      )
      .then(Commands.literal('join')
        .executes(ctx => {
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
          let teamlist=Utils.server.persistentData.TeamList;
          var latestInviteTeam=""
          for (var teamName in teamlist){
            let team=String(teamlist[teamName].invitedPlayers)
            if (team.match(`"${playerName}"`)){
              latestInviteTeam=teamName
            }
          }
          if (joinTeam(latestInviteTeam, playerName)) {
            const ftbname =server.persistentData.PlayerFTB
            player.runCommandSilent(`mine_and_slash teams join ${teamlist[latestInviteTeam].leader}`)
            player.runCommandSilent(`ftbteams party join ${ftbname[playerName]}`)
            server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]成功加入队伍 ${latestInviteTeam} ，聊天开头添加 ! 标识可队内聊天！","color":"green"}`);
            return 1;
          } else {
            server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]您没有被邀请加入任何队伍","color":"green"}`);
            return 0;
          }
        })
      )
      .then(Commands.literal("kick")
        .then(Commands.argument("name", Arguments.STRING.create(event))
          .executes(ctx => {
            var name = Arguments.STRING.getResult(ctx, "name");
            var player = ctx.source.playerOrException;
            var server = ctx.source.server;
            var playerName = player.getName().getString();
 
            if (kickFromTeam(playerName, name)) {
              player.runCommandSilent(`mine_and_slash teams kick ${name}`)
              player.runCommandSilent(`ftbteams party kick ${name}`)
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]玩家 ${name} 已被移出队伍","color":"green"}`);
              server.runCommandSilent(`tellraw ${Name} {"text":"[Teams]你已被移出队伍","color":"green"}`);
              return 1;
            } else {
              server.runCommandSilent(`tellraw ${playerName} {"text":"[Teams]移出玩家失败","color":"green"}`);
              return 0;
            }
          })
        )
        .executes(ctx=>{
          var player = ctx.source.playerOrException;
          var server = ctx.source.server;
          var playerName = player.getName().getString();
          var playerTeam = getTeamByPlayer(playerName);
          if (playerTeam) {
            server.runCommandSilent(`tellraw ${playerName} {"text":"======当前队伍玩家列表======","color":"yellow"}`);
            let cont=""
            let count=0
            playerTeam.member.forEach(name=>{
              name=String(name).slice(1,-1)
              if (count < 4){
              if (cont == ""){
                cont = `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams kick '${name}'"},"hoverEvent":{"action":"show_text","value":"踢出 ${name}"}}`
                } else {
                    cont = cont +","+ `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams kick '${name}'"},"hoverEvent":{"action":"show_text","value":"踢出 ${name}"}}`
                }
                count++;
              } else {
                  cont = cont +","+ `{"text":" ${name} ，","color":"yellow","clickEvent":{"action":"run_command","value":"/teams kick '${name}'"},"hoverEvent":{"action":"show_text","value":"踢出 ${name}"}}`
                  server.runCommandSilent(`tellraw ${playerName} [${cont}]`)
                  count = 0
                  cont=""
              }
            })
            server.runCommandSilent(`tellraw ${playerName} [${cont}]`)
            return 1;
          }
          return 0;
        })
      )
  );
});
PlayerEvents.chat(e=>
  {
    if (e.player.persistentData.TeamCreate=="True")
      {
        if (e.message.toLowerCase()=="t"){
          e.server.runCommandSilent(`tellraw ${e.player.username} {"text":"[Teams]你已取消创建队伍","color":"yellow"}`)
          e.player.persistentData.TeamCreate="False"
          e.cancel()
        }
        e.player.runCommandSilent(`/teams create "${e.message}"`)
        e.cancel()
      }
      if (e.message.slice(0,1)=="!" || e.message.slice(0,1)=="！" ){
        var teamInfo = getTeamByPlayer(e.player.username);
        if (teamInfo) {
          var message = String(e.message).slice(1)
          teamInfo.member.forEach(me=>{
            e.server.runCommandSilent(`tellraw ${String(me).slice(1,-1)} [{"text":"[${teamInfo.name}] ","color":"yellow"}, {"text":"<${e.player.username}> ${message}","color":"white"}]`)
        })
        e.server.runCommandSilent(`tellraw ${teamInfo.leader} [{"text":"[${teamInfo.name}] ","color":"yellow"}, {"text":"<${e.player.username}> ${message}","color":"white"}]`)
        e.cancel()
      }
      }
    }
)