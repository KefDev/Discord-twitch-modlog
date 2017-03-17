module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.content.split(" ")[1] != null) {
            Client.functions.trackNames(Client, m.content.split(" ")[1].toLowerCase()).then(data => {
                Client.functions.sendEmbed("namesFound", true, server.language, "success", [m.content.split(" ")[1].toLowerCase(), data.names], Client, m);
            }).catch(response => {
                Client.functions.sendEmbed("namesNotFound", true, server.language, "error", [null, null, null], Client, m);
            });
        } else Client.functions.sendEmbed("invalidArgument", true, server.language, "error", ["null", null, null], Client, m);
    }
};
