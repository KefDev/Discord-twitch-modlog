"use strict";

const mysql = require("mysql"),
    tmi = require("tmi.js"),
    http = require("http"),
    exec = require("child_process").exec,
    ShardManager = require("./pubsub/ShardManager.js");


//----------------------------------------------------------------------------//
//                                  Client                                    //
//----------------------------------------------------------------------------//


const Client = {
    config: require("./config.json"),
    channels: [],
    ignoredGuilds: require("./config.json").ignoredGuilds,

    db: mysql.createConnection({
        host: require("./config.json").mysqlhost,
        user: require("./config.json").mysqluser,
        password: require("./config.json").mysqlpw,
        database: require("./config.json").mysqldb
    }),

    twitch: new tmi.client({
        options: {
            debug: false
        },
        connection: {
            reconnect: true
        },
        identity: {
            username: require("./config.json").twitchusername,
            password: require("./config.json").twitchpassword
        },
        channels: require("./config.json").twitchchannels
    }),

    pubsub: new ShardManager({
        token: require("./config.json").pubsubToken,
        topics: ["109809601"],
        mod_id: "109809601"
    }),

    functions: require("./functions.js"),

    request: require("request"),
    fs: require("fs")
};


//----------------------------------------------------------------------------//
//                              Connecting the bots                           //
//----------------------------------------------------------------------------//


Client.twitch.connect();

Client.pubsub.on("ready", () => {
    setTimeout(() => {
        Client.functions.connectChannels(Client);
    }, 20 * 1000);
});


//----------------------------------------------------------------------------//
//                         When the bot is added to a channel                 //
//----------------------------------------------------------------------------//

Client.twitch.on("mods", (channel, mods) => {
    console.log(mods);
    Client.functions.setMod(Client, channel, mods);
});

//----------------------------------------------------------------------------//
//                          Log things in the database                        //
//----------------------------------------------------------------------------//


Client.pubsub.on("ban", (shard, ban) => {
    Client.functions.addLog(Client, ban);
});

Client.pubsub.on("unban", (shard, unban) => {
    Client.functions.addLog(Client, unban);
});

Client.pubsub.on("timeout", (shard, timeout) => {
    Client.functions.addLog(Client, timeout);
});


//----------------------------------------------------------------------------//
//                     Every disconnected / Debug events                      //
//----------------------------------------------------------------------------//


Client.twitch.on("disconnected", reason => {
    console.log(reason);
    process.exit(1);
});


Client.pubsub.on("debug", (e, opt) => {
    console.log(e, opt);
});


Client.pubsub.on("shard-ready", shard => {
    console.log(`Shard ${shard.id} is ready`);
});

//Force-disconnects everything.

process.on("SIGINT", () => {
    Client.twitch.disconnect();
    setTimeout(() => {
        process.exit(1);
    }, 5000);
});


//----------------------------------------------------------------------------//
//                                 AUTO-GITPULL                               //
//----------------------------------------------------------------------------//

let server = http.createServer((req) => {
    if (req.method == "POST") {
        exec("git pull git@github.com:Equinoxbig/Discord-twitch-modlog.git total-rewrite", function(error, stdout, stderr) {
            console.log("stdout : " + stdout + "\nstderr :" + stderr);
            if (error !== null) console.log("exec error: " + error);
        });
    }
});

server.listen(1338);
