module.exports = (Client, channel, mods) => {
    if (mods.includes(Client.config.twitchusername)) {
        Client.db.query("UPDATE global SET twitchmod = 1 WHERE twitchChannel = ?", [channel]);
        channel = channel.substring(1, channel.length);
        Client.functions.trackUser(channel).then(data => {
            Client.pubsub.addTopic(data.users[0]._id).catch(reason => {
                console.log(reason);
            });
        });
    } else {
        Client.db.query("UPDATE global SET twitchmod = 0 WHERE twitchChannel = ?", [channel]);
    }
};
