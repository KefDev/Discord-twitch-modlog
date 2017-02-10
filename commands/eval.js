module.exports = {
    exec: function(Client, m, server) {
        m.delete();
        if (m.author.id == 76841662445256704) {
            let code = m.content.substring(6, m.content.length);
            try {
                let evaled = eval(code);
                embed(code, evaled, m, Client, "success");
            } catch (e) {
                embed(code, e, m, Client, "ban");
            }
        }
    }
};

function embed(code, evaled, m, Client, status) {
    m.channel.createMessage({
        content: "\n",
        embed: {
            color: Client.config.colors[status],
            timestamp: new Date(),
            fields: [{
                name: "To evaluate :",
                value: "```js\n" + code + "\n```",
                inline: false
            }, {
                name: "Result :",
                value: "```js\n" + evaled + "\n```",
                inline: false
            }]
        }
    });
}
