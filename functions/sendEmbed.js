module.exports = function(message, dm, lang, type, arg, Client, m) {
    let embed, msg;
    if (type == "error") {
        msg = Client.lang[lang].errors[message].reason.replace("{0}", arg[0]);
        msg = msg.replace("{1}", arg[1]);
        msg = msg.replace("{2}", arg[2]);

        embed = {
            content: "\n",
            embed: {
                color: Client.config.colors.ban,
                timestamp: new Date(),
                description: Client.lang[lang].sentences.error,
                fields: [{
                    name: Client.lang[lang].words.error + " :",
                    value: Client.lang[lang].errors[message].message,
                    inline: false
                }, {
                    name: Client.lang[lang].words.details + " :",
                    value: msg,
                    inline: false
                }]
            }
        };
    } else if (type == "success") {
        msg = Client.lang[lang].success[message].message.replace("{0}", arg[0]);
        msg = msg.replace("{1}", arg[1]);
        msg = msg.replace("{2}", arg[2]);

        embed = {
            content: "\n",
            embed: {
                color: Client.config.colors.success,
                timestamp: new Date(),
                description: Client.lang[lang].sentences.success,
                fields: [{
                    name: Client.lang[lang].words.success + " :",
                    value: msg,
                    inline: false
                }]
            }
        };
    }
    if (dm == true) Client.functions.privateMessage(Client, m.author.id, embed);
    else m.channel.createMessage(embed).catch(error => {
        Client.fs.writeFile(Math.random() + ".txt", error.toString());
    });
};
