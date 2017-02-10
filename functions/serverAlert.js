module.exports = function(Client, guild, action, bots, admins) {
    let color;
    action == "joined" ? color = "success" : color = "ban"; //Too lazy to have more than 3 different colors.

    Client.discord.createMessage("279264326013943809", {
        content: "\n",
        embed: {
            timestamp: new Date(),
            color: Client.config.colors[color],
            description: "I just " + action + " the server : " + guild.name,
            thumbnail: {
                url: guild.iconURL
            },
            fields: [{
                name: "Humans :",
                value: guild.memberCount,
                inline: true
            }, {
                name: "Bots :",
                value: bots,
                inline: true
            }]
        }
    });

    let embed = {
        "content": "\n",
        "embed": {
            "description": "You're receiving this message because I've been invited to your server : `" + guild.name + "` and you have the manage Server permission.\nPlease take a look at my commands by doing ?help on your server",
            "color": Client.config.colors.neutral,
        }
    };

    if (admins != null && !Client.config.ignoredGuilds.includes(guild.id)) {
        for (let i = 0; i < admins.length; i++) {
            Client.functions.privateMessage(Client, admins[i], embed);
        }
    }
};
