module.exports = (Client, channel, mods) => {
    console.log(`${channel} mods are : `, mods);
    if (mods.includes(Client.config.twitchusername.toLowerCase())) {
        Client.db.query('UPDATE global SET modo = 1 WHERE LOWER(name) = ?', [channel.substring(1, channel.length)]);
        Client.functions.trackUser(Client, channel.substring(1, channel.length)).then(data => {
            Client.pubsub.addTopic(data.users[0]._id).then(data => {
                console.log('topic added ', data);
            }).catch(reason => {
                Client.db.query('UPDATE global SET modo = -1 WHERE id = ?', reason.topic);
            });
        });
    } else {
        Client.db.query('UPDATE global SET modo = -1 WHERE LOWER(name) = ?', [channel.substring(1, channel.length)]);
    }
};
