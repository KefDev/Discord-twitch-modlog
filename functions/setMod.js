module.exports = (Client, channel, mods) => {
    console.log(`${channel} mods are : `, mods);
    if (mods.includes(Client.config.twitchusername.toLowerCase())) {
        Client.db.query("UPDATE global SET twitchmod = 1 WHERE twitchChannel = ?", [channel]);
        channel = channel.substring(1, channel.length);
        Client.functions.trackUser(Client, channel).then(data => {
            Client.pubsub.addTopic(data.users[0]._id).then(data => {
                console.log("topic added ", data);
            }).catch(reason => {
                console.log(reason);
            });
        });
    } else {
        Client.db.query("UPDATE global SET twitchmod = 0 WHERE twitchChannel = ?", [channel]);
    }
};
