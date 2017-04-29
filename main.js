'use strict';

const mysql = require('mysql'),
    tmi = require('tmi.js'),
    exec = require('child_process').exec,
    app = require('express')(),
    helmet = require('helmet'),
    ShardManager = require('./pubsub/ShardManager.js');


//----------------------------------------------------------------------------//
//                                  Client                                    //
//----------------------------------------------------------------------------//


const Client = {
    config: require('./config2.json'),
    channels: [],

    db: mysql.createConnection({
        host: require('./config2.json').mysqlhost,
        user: require('./config2.json').mysqluser,
        password: require('./config2.json').mysqlpw,
        database: require('./config2.json').mysqldb
    }),

    twitch: new tmi.client({
        options: {
            debug: false
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: require('./config2.json').twitchusername,
            password: require('./config2.json').twitchpassword
        },
        channels: require('./config2.json').twitchchannels
    }),

    pubsub: new ShardManager({
        token: require('./config2.json').pubsubToken,
        topics: ['109809601'],
        mod_id: '109809601'
    }),

    functions: require('./functions.js'),

    request: require('request'),
    fs: require('fs')
};


//----------------------------------------------------------------------------//
//                              Connecting the bots                           //
//----------------------------------------------------------------------------//


Client.twitch.connect();

Client.pubsub.on('ready', () => {
    setTimeout(() => {
        Client.functions.connectChannels(Client);
    }, 20 * 1000);
});


//----------------------------------------------------------------------------//
//                         When the bot is added to a channel                 //
//----------------------------------------------------------------------------//

Client.twitch.on('mods', (channel, mods) => {
    Client.functions.addChannel(Client, channel, mods);
});

//----------------------------------------------------------------------------//
//                          Log things in the database                        //
//----------------------------------------------------------------------------//


Client.pubsub.on('ban', (shard, ban) => {
    Client.functions.addLog(Client, ban);
});

Client.pubsub.on('unban', (shard, unban) => {
    Client.functions.addLog(Client, unban);
});

Client.pubsub.on('timeout', (shard, timeout) => {
    Client.functions.addLog(Client, timeout);
});


//----------------------------------------------------------------------------//
//                     Every disconnected / Debug events                      //
//----------------------------------------------------------------------------//


Client.twitch.on('disconnected', reason => {
    console.log(reason);
    process.exit(1);
});


Client.pubsub.on('debug', (e, opt) => {
    console.log(e, opt);
});


Client.pubsub.on('shard-ready', shard => {
    console.log(`Shard ${shard.id} is ready`);
});

//Force-disconnects everything.

process.on('SIGINT', () => {
    Client.twitch.disconnect();
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});


//----------------------------------------------------------------------------//
//                                 COMMUNICATING                              //
//----------------------------------------------------------------------------//

app.use(helmet());
app.disable('x-powered-by');
app.listen(1338, 'localhost');

app.post('/add', (req, res) => {
    Client.twitch.mods(req.body.channel);
    res.status(200).json({
        result: 'OK',
        code: 200,
        message: 'Request received. Currently checking the channel. Come back in a few seconds.'
    });
    Client.db.query('UPDATE global SET modo = 0 WHERE LOWER(name) = ?', [req.body.channel]);
});

app.post('/gitpush', () => {
    exec('git pull', (error, stdout, stderr) => {
        console.log('stdout : ', stdout, '\nstderr :', stderr);
        if (error !== null) console.log('exec error: ', error);
    });
});

app.post('/remove', (req, res) => {
    Client.db.query('UPDATE global SET modo = -1 WHERE LOWER(name) = ?', [req.body.channel]);
    Client.twitch.part(req.body.channel);
    res.status(200).json({
        result: 'OK',
        code: '200',
        message: 'Your channel has been removed from the channels to watch. Moderation actions will no long be logged.'
    });
});
