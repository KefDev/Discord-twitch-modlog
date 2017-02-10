module.exports = function(Client, m) {
    var id;
    Client.db.query("SELECT * FROM `" + m.channel.guild.id + "` ORDER BY caseID DESC LIMIT 1", (error, results) => {
        if (error) console.log(error);
        else {
            if (["latest", "last", "|"].includes(m.content.split(" ")[1].toLowerCase())) id = results[0].caseID;
            else if (m.content.split(" ")[1] == parseInt(m.content.split(" ")[1], 10)) id = parseInt(m.content.split(" ")[1], 10);
            if (id != null && id <= results[0].caseID) {
                let reason = m.content.split(" ").splice(2).join(" ");
                Client.db.query("SELECT * FROM global WHERE discordID = ?", [m.channel.guild.id], (error, results) => {
                    let server = results[0];
                    Client.db.query("SELECT * FROM `" + server.discordID + "` WHERE caseID = ?", [id], (error, results) => {
                        Client.db.query("UPDATE `" + server.discordID + "` SET msgID = ?, twitchname = ?, modID =?, reason =?, type =?, duration =? WHERE caseID = ?", [results[0].msgID, results[0].twitchname, m.author.id, reason, results[0].type, results[0].duration, id]);

                        let beautifytype = results[0].type[0].toUpperCase() + results[0].type.substring(1, results[0].type.length);
                        Client.discord.getMessage(server[results[0].type + "Channel"], results[0].msgID).then(msg => {
                            msg.edit({
                                content: "\n",
                                embed: {
                                    color: Client.config.colors[results[0].type],
                                    timestamp: new Date(),

                                    fields: [{
                                        "name": "ID :",
                                        "value": id,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.type + " :",
                                        "value": beautifytype,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.user + " :",
                                        "value": results[0].twitchname,
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.moderator + " :",
                                        "value": "<@" + m.author.id + ">",
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.reason + " :",
                                        "value": reason,
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.duration + " :",
                                        "value": results[0].duration,
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.date + " :",
                                        "value": results[0].date,
                                        "inline": false
                                    }]
                                }
                            }).catch(e => {
                                console.log(e);
                            });
                        });
                    });
                });
            }
        }
    });
};
