const moment = require("moment");

module.exports = (Client, action) => {

    Client.db.query("SELECT * FROM global WHERE channelID = ?", [action.channel_id], (error, results) => {
        if (error) console.log(error);
        else if (results[0] == null) return;
        else {

            let server = results[0];
            moment.locale(server.language);

            Client.db.query("SELECT * FROM `" + server.discordID + "` ORDER BY caseID DESC LIMIT 1", (error, results) => {
                if (error) console.log(error);
                else {
                    var caseID;
                    results[0] != null ? caseID = results[0].caseID + 1 : caseID = 0;

                    if (action.duration == "permanent") action.duration = Client.lang[server.language].words.permanent;
                    if (action.reason == null) action.reason = Client.lang[server.language].sentences.enter_reason + "`" + server.prefix + "reason " + caseID + " " + Client.lang[server.language].words.reason.toLowerCase() + "`";
                    let mod = Client.lang[server.language].words.unknown,
                        date = moment().format("LLLL"),
                        beautifytype = action.type[0].toUpperCase() + action.type.substring(1, action.type.length);


                    if (server[action.type + "Channel"] != ".") {
                        Client.db.query("SELECT COUNT(*) AS numberActions FROM `" + server.discordID + "` WHERE twitchid = ?", [action.target.id], (error, results) => {
                            let actions = results[0].numberActions || 1;
                            Client.discord.createMessage(server[action.type + "Channel"], {
                                content: "\n",
                                embed: {
                                    color: Client.config.colors[action.type],
                                    timestamp: new Date(),

                                    fields: [{
                                        "name": "ID :",
                                        "value": caseID,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.type + " :",
                                        "value": beautifytype,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.user + " :",
                                        "value": action.target.name + " (" + action.target.id + ")",
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].sentences.actions + " :",
                                        "value": actions,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.moderator + " :",
                                        "value": action.author.name + " (" + action.author.id + ")",
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.reason + " :",
                                        "value": action.reason,
                                        "inline": false
                                    }, {
                                        "name": Client.lang[server.language].words.duration + " :",
                                        "value": action.duration,
                                        "inline": true
                                    }, {
                                        "name": Client.lang[server.language].words.date + " :",
                                        "value": date,
                                        "inline": true
                                    }]
                                }
                            }).then(message => {
                                Client.db.query("INSERT INTO `" + server.discordID + "` SET msgID = ?, twitchname = ?, twitchid = ?, modID = ?, reason = ?, type = ?, duration = ?, date = ?", [message.id, username, data.users[0]._id, mod, reason, type, duration, date]); //ID auto-increments itself
                            });
                        });
                    }

                }
            });
        }
    });
};
