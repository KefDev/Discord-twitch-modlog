module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.content.split(" ")[1] != null) {
            Client.functions.trackUser(Client, m.content.split(" ")[1].toLowerCase()).then(data => {
                Client.functions.sendEmbed("twitchIdFound", true, server.language, "success", [m.content.split(" ")[1].toLowerCase(), data.users[0]._id], Client, m);
            }).catch(response => {
                Client.functions.sendEmbed("twitchIdNotFound", true, server.language, "error", ["Tried to find id of : " + m.content.split(" ")[1].toLowerCase(), response.status + " : " + response.error, response.message], Client, m);
            });
        } else Client.functions.sendEmbed("invalidArgument", true, server.language, "error", ["null", null, null], Client, m);
    }
};
