module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.member.permission.has("manageGuild") == true) {
            if (m.content.split(" ")[1] != null) {
                let prefix = m.content.toLowerCase().substring(server.prefix.length + 7, m.content.length);
                if (prefix.length < 17) {

                    Client.db.query("UPDATE global SET prefix = ? WHERE discordID = ?", [prefix.toLowerCase(), m.channel.guild.id]);
                    Client.functions.sendEmbed("newprefix", false, server.language, "success", [prefix.toLowerCase(), null, null], Client, m);

                } else Client.functions.sendEmbed("longPrefix", false, server.language, "error", [null, null, null], Client, m);
            } else Client.functions.sendEmbed("invalidArgument", false, server.language, "error", ["null", null, null], Client, m);
        } else Client.functions.sendEmbed("noAdmin", true, server.language, "error", [null, null, null], Client, m);
    }
};
