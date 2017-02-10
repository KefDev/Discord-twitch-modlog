module.exports = {
    exec: function(Client, m, server) {
        if (m.member.permission.has("manageGuild") == true) {
            m.delete();
            if (m.content.split(" ")[1] != null) {
                let language;
                if (["french", "français", "fr"].includes(m.content.split(" ")[1].toLowerCase())) language = "fr";
                else if (["english", "anglais", "en"].includes(m.content.split(" ")[1].toLowerCase())) language = "en";
                else language = "unknown";

                if (language != "unknown") {
                    Client.functions.sendEmbed("newlanguage", false, language, "success", [language, Client.config.availableLangs, null], Client, m);
                    Client.db.query("UPDATE global SET language = ? WHERE discordID = ?", [language, m.channel.guild.id]);

                } else Client.functions.sendEmbed("unknownLang", false, server.language, "error", [Client.config.availableLangs, null, null], Client, m);
            } else Client.functions.sendEmbed("invalidArgument", false, server.language, "error", ["null", null, null], Client, m);
        } else Client.functions.sendEmbed("noAdmin", true, server.language, "error", [null, null, null], Client, m);
    }
};
