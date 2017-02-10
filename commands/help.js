module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.channel.id == server.timeoutChannel || m.channel.id == server.banChannel || m.member.permission.has("manageGuild") == true || m.channel.guild.id == 110373943822540800) Client.functions.privateMessage(Client, m.author.id, Client.lang[server.language].commands);
    }
};
