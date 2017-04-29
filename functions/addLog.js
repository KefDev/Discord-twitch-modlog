const moment = require('moment');
moment.locale('en');

module.exports = (Client, action) => {
    Client.db.query('SELECT * FROM config WHERE id = ?', [action.channel_id], (err, rows) => {
        if (err) console.log(err);
        else if (rows[0]) {
            rows[0][`${action.type}s`] += 1;
            rows[0].webhooks = JSON.parse(rows[0].webhooks);
            rows[0].cas += 1;
            Client.db.query('UPDATE config SET bans = ?, unbans = ?, timeouts = ?, cas = ? WHERE id = ?', [rows[0].bans, rows[0].unbans, rows[0].timeouts, rows[0].cas, action.channel_id]);
            Client.db.query('INSERT INTO "' + action.channel_id + '" SET type = ?, author_id = ?, author_name = ?, target_id = ?, target_name = ?, reason = ?, duration = ?, created_at = ?, cas =  ?', [action.type, action.author.id, action.author.name, action.target.id, action.target.name, action.reason, action.duration, action.created_at, rows[0].cas]);
            rows[0].webhooks.forEach(webhook => {
                try {
                    require(`./webhooks/postTo${webhook.platform}`)(Client, action, webhook.url, rows[0].cas);
                } catch (e) {
                    if (e) console.log(e);
                }
            });
        } else return;
    });
};
