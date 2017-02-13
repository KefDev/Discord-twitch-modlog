module.exports = {
    exec: function(Client, m, server) {
        if (m.member.permission.has("manageGuild") == true) {
            if (m.content.split(" ")[1] != null) {

                Client.db.query("SELECT * FROM global WHERE twitchChannel = ?", ["#" + m.content.split(" ")[1].toLowerCase()], (error, results) => {
                    if (error) console.log(error);
                    else if (results[0] != null) Client.functions.sendEmbed("twitchTaken", false, server.language, "error", [m.content.split(" ")[1].toLowerCase(), null, null], Client, m);
                    else {
                        if (server.twitchChannel.startsWith("#")) Client.twitch.part(server.twitchChannel);
                        if (m.content.split(" ")[1].toLowerCase() == "disconnect") Client.functions.sendEmbed("leftchannel", false, server.language, "success", [null, null, null], Client, m);
                        else {
                            Client.db.query("UPDATE global SET twitchChannel = ? WHERE discordID = ?", ["#" + m.content.split(" ")[1].toLowerCase(), m.channel.guild.id]);
                            Client.twitch.join("#" + m.content.split(" ")[1].toLowerCase());

                            server.banChannel == "." ? server.banChannel = "nowhere" : server.banChannel = "<#" + server.banChannel + ">";
                            server.timeoutChannel == "." ? server.timeoutChannel = "nowhere" : server.timeoutChannel = "<#" + server.timeoutChannel + ">";

                            Client.functions.sendEmbed("newtwitch", false, server.language, "success", [m.content.split(" ")[1].toLowerCase(), server.timeoutChannel, server.banChannel], Client, m);
                        }
                    }
                });
            } else Client.functions.sendEmbed("invalidArgument", false, server.language, "error", ["null", null, null], Client, m);
        } else Client.functions.sendEmbed("noAdmin", true, server.language, "error", [null, null, null], Client, m);
    }
};
