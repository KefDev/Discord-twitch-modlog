const moment = require('moment');
moment.locale('en');

module.exports = (Client, action, webhook, cas) => {

    let colors = {
        timeout: 16759354,
        ban: 16711680,
        unban: 65280
    };

    let options = {
        url: webhook,
        method: 'POST',
        body: {
            content: '\n',
            username: 'Twitch Mod-Log',
            avatar_url: 'https://raw.githubusercontent.com/Equinoxbig/Discord-twitch-modlog/master/icon.png',
            embeds: [{
                title: `New ${action.type}`,
                color: colors[action.type],
                timestamp: new Date(),
                fields: [{
                    name: 'ID : ',
                    value: cas,
                    inline: true
                }, {
                    name: 'Type : ',
                    value: action.type,
                    inline: true
                }, {
                    name: 'Date : ',
                    value: `${moment(action.created_at).format('LLLL')} GMT+1`,
                    inline: false
                }, {
                    name: 'Moderator name : ',
                    value: action.author.name,
                    inline: true
                }, {
                    name: 'Moderator ID : ',
                    value: action.author.id,
                    inline: true
                }, {
                    name: 'Target name : ',
                    value: action.target.name,
                    inline: false
                }, {
                    name: 'Target ID : ',
                    value: action.target.id,
                    inline: true
                }, {
                    name: 'Duration: ',
                    value: action.duration,
                    inline: false
                }, {
                    name: 'Reason : ',
                    value: action.reason,
                    inline: true
                }]
            }]
        },
        json: true
    };

    Client.request(options);
};
