module.exports = function(Client, id, object) {
    Client.discord.getDMChannel(id).then(channel => {
        channel.createMessage(object);
    }).catch(error => {
        console.log(error);
    });
};
