module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        console.log("Tracking user : " + m.content.split(" ")[1]);
        if (m.content.split(" ")[1] != null) {
            Client.functions.trackUser(Client, m.content.split(" ")[1].toLowerCase()).then(data => {
                console.log(data);
                Client.functions.sendEmbed("twitchIdFound", true, server.language, "success", [m.content.split(" ")[1].toLowerCase(), data.users[0]._id], Client, m);
            }).catch(response => {
                console.log(response);
                Client.functions.sendEmbed("twitchIdNotFound", true, server.language, "error", ["Tried to find id of : " + m.content.split(" ")[1].toLowerCase(), response.status + " : " + response.error, response.message]);
            });
        } else Client.functions.sendEmbed("invalidArgument", true, server.language, "error", ["null", null, null], Client, m);
    }
};
