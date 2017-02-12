module.exports = function(Client) {

    let options = {
        url: "https://bots.discord.pw/api/bots/279640502717120512/stats",
        method: "POST",
        headers: {
            Authorization: Client.config.dBOTS_api,
            "Content-Type": "application/json"
        },
        body: {
            server_count: parseInt(Client.discord.guilds.size, 10)
        },
        json: true
    };

    Client.request(options);
};
