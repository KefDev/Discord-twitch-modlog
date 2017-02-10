module.exports = function(Client, m, server) {

    Client.db.query("SELECT * FROM global WHERE discordID = ?", [m.channel.guild.id], (error, results) => {
        if (error) console.log(error);
        else if (results[0] != null) {

            let totaltimeouts, totalbans, channel;

            Client.db.query("SELECT COUNT(*) AS number FROM `" + m.channel.guild.id + "` WHERE type = 'timeout'", (error, results) => {
                totaltimeouts = results[0].number || 0;

                Client.db.query("SELECT COUNT(*) AS number FROM `" + m.channel.guild.id + "` WHERE type = 'ban'", (error, results) => {
                    totalbans = results[0].number || 0;

                    server.twitchChannel == "." ? channel = Client.lang[server.language].sentences.pls + "!twitch channel" : channel = server.twitchChannel.replace("#", "");

                    m.channel.createMessage({
                        content: "<@" + m.author.id + ">",
                        embed: {
                            color: Client.config.colors.neutral,
                            description: Client.lang[server.language].sentences.stats,
                            fields: [{
                                name: "Timeouts : ",
                                value: totaltimeouts,
                                inline: true
                            }, {
                                name: "Bans : ",
                                value: totalbans,
                                inline: true
                            }, {
                                name: Client.lang[server.language].words.prefix + " :",
                                value: server.prefix,
                                inline: false
                            }, {
                                name: Client.lang[server.language].words.channel + " :",
                                value: channel,
                                inline: true
                            }]
                        }
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 60000);
                    });
                });
            });
        }
    });

};
