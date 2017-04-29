const moment = require('moment');
moment.locale('en');

module.exports = (Client, action, webhook, cas) => {

    let options = {
        url: webhook,
        method: 'POST',
        body: {
            content: '\n',
            username: 'Twitch Mod-Log',
            avatar_url: 'https://raw.githubusercontent.com/Equinoxbig/Discord-twitch-modlog/master/icon.png',
            data: action,
            case: cas
        },
        json: true
    };

    Client.request(options);
};
