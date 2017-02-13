const moment = require("moment");

module.exports = function(channel, username, reason, duration, type, Client) {

    Client.db.query("SELECT * FROM global WHERE twitchChannel = ?", [channel], (error, results) => {
        if (error) console.log(error);
        else if (results[0] == null) return;
        else {

            let server = results[0];
            moment.locale(server.language);

            Client.db.query("SELECT * FROM `" + server.discordID + "` ORDER BY caseID DESC LIMIT 1", (error, results) => {
                if (error) console.log(error);
                else {
                    var caseID;
                    results[0] != null ? caseID = results[0].caseID + 1 : caseID = 1;

                    if (duration == null) duration = Client.lang[server.language].words.permanent;
                    if (reason == null) reason = Client.lang[server.language].sentences.enter_reason + "`" + server.prefix + "reason " + caseID + " " + Client.lang[server.language].words.reason.toLowerCase() + "`";
                    let mod = Client.lang[server.language].words.unknown,
                        date = moment().format("LLLL"),
                        beautifytype = type[0].toUpperCase() + type.substring(1, type.length);

                    Client.functions.trackUser(Client, username)
                        .then(data => {
                            username = username + " (" + data.users[0]._id + ")";
                            if (server[type + "Channel"] != ".") {
                                Client.discord.createMessage(server[type + "Channel"], {
                                    content: "\n",
                                    embed: {
                                        color: Client.config.colors[type],
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
                                            "value": username,
                                            "inline": false
                                        }, {
                                            "name": Client.lang[server.language].words.moderator + " :",
                                            "value": mod,
                                            "inline": false
                                        }, {
                                            "name": Client.lang[server.language].words.reason + " :",
                                            "value": reason,
                                            "inline": false
                                        }, {
                                            "name": Client.lang[server.language].words.duration + " :",
                                            "value": duration,
                                            "inline": false
                                        }, {
                                            "name": Client.lang[server.language].words.date + " :",
                                            "value": date,
                                            "inline": false
                                        }]
                                    }
                                }).then(message => {
                                    Client.db.query("INSERT INTO `" + server.discordID + "` SET msgID = ?, twitchname = ?, modID = ?, reason = ?, type = ?, duration = ?, date = ?", [message.id, username, mod, reason, type, duration, date]); //ID auto-increments itself
                                });
                            }
                        })
                        .catch(error => {
                            username = username + " (" + Client.lang[server.language].errors.twitchIdNotFound.message + ")";
                            console.log(error.error + "\n" + error.message + "\n" + username);
                        });
                }
            });
        }
    });
};
