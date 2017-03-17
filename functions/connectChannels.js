module.exports = function(Client) {

    let query = Client.db.query("SELECT * FROM global WHERE twitchChannel != '.'");
    query
        .on("error", error => {
            console.log(error);
        }).on("result", row => {
            Client.db.pause();
            Client.twitch.join(row.twitchChannel);

            if (row.twitchmod) {
                Client.pubsub.addTopic(row.channelID).then(() => {
                    Client.db.resume();
                }).catch(() => {
                    Client.db.resume();
                });
            } else {
                Client.db.resume();
            }

        }).on("end", () => {
            console.log("Connected to every channel");
        });

};
