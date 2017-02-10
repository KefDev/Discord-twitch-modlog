module.exports = function(Client) {

    let query = Client.db.query("SELECT * FROM global WHERE twitchChannel != '.'");
    query
        .on("error", error => {
            console.log(error);
        }).on("result", row => {
            Client.db.pause();
            Client.twitch.join(row.twitchChannel);
            setTimeout(() => {
                Client.db.resume();
            }, 1);
        }).on("end", () => {
            console.log("end");
        });

};
