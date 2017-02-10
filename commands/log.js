module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        //let response;
        if (m.member.permission.has("manageGuild") == true) {
            if (m.content.split(" ")[0] != null && m.content.split(" ")[1] != null && m.content.split(" ")[2] != null) {
                let channel = "XD";
                if (["stop", "off"].includes(m.content.split(" ")[2].toLowerCase())) channel = "."; //Set the channel to something retarded in order to avoid sending messages.
                else if (["here", "on"].includes(m.content.split(" ")[2].toLowerCase())) channel = m.channel.id;
                else if (m.channelMentions[0] != null) channel = m.channelMentions[0];

                if (["timeout", "ban"].includes(m.content.split(" ")[1].toLowerCase()) && channel != "XD") {

                    Client.db.query("UPDATE global SET `" + m.content.split(" ")[1].toLowerCase() + "Channel` = ? WHERE discordID = ?", [channel, m.channel.guild.id]);
                    if (channel != ".") {
                        Client.functions.sendEmbed("nowlog", false, server.language, "success", [m.content.split(" ")[1].toLowerCase(), "<#" + channel + ">", null], Client, m);
                    } else {
                        Client.functions.sendEmbed("stoplog", false, server.language, "success", [m.content.split(" ")[1].toLowerCase(), null, null], Client, m);
                    }

                } else Client.functions.sendEmbed("invalidArgument", false, server.language, "error", [m.content.split(" ")[1].toLowerCase(), null, null], Client, m);
            } else Client.functions.sendEmbed("invalidArgument", false, server.language, "error", ["null", null, null], Client, m);
        } else Client.functions.sendEmbed("noAdmin", true, server.language, "error", [null, null, null], Client, m);
    }
};
