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
                        let user = results[0];
                        Client.functions.trackUser(Client, user.twitchname.split(" ")[0])
                            .then(data => {
                                Client.db.query("SELECT COUNT(*) AS numberActions FROM `" + server.discordID + "` WHERE twitchid = ?", [data.users[0]._id], (error, results) => {
                                    let actions = results[0].numberActions || 1;

                                    let beautifytype = user.type[0].toUpperCase() + user.type.substring(1, user.type.length);
                                    Client.discord.getMessage(server[user.type + "Channel"], user.msgID).then(msg => {
                                        msg.edit({
                                            content: "\n",
                                            embed: {
                                                color: Client.config.colors[user.type],
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
                                                    "value": user.twitchname,
                                                    "inline": false
                                                }, {
                                                    "name": Client.lang[server.language].sentences.actions + " :",
                                                    "value": actions,
                                                    "inline": true
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
                                                    "value": user.duration,
                                                    "inline": false
                                                }, {
                                                    "name": Client.lang[server.language].words.date + " :",
                                                    "value": user.date,
                                                    "inline": false
                                                }]
                                            }
                                        }).catch(e => {
                                            console.log(e);
                                        });
                                    });
                                });
                            }).catch(error => {
                                console.log(error.error + "\n" + error.message + "\n" + user.twitchname);
                            });
                    });
                });
            }
        }
    });
};
