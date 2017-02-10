module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.content.split(" ")[1] != null && m.content.split(" ")[2] != null && m.channel.id == server.timeoutChannel || m.content.split(" ")[1] != null && m.content.split(" ")[2] != null && m.channel.id == server.banChannel) {
            Client.functions.modifyLog(Client, m);
        }
    }
};
