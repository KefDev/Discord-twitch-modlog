"use strict";

const mysql = require("mysql"),
    tmi = require("tmi.js"),
    http = require("http"),
    exec = require("child_process").exec,
    Eris = require("eris");


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


    discord: new Eris(require("./config.json").discordtoken, {
        autoreconnect: true,
        compress: true,
        getAllUsers: true,
        moreMentions: true,
        gatewayVersion: 6,
        disableEveryone: false
    }),


    twitch: new tmi.client({
        options: {
            debug: true
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

    functions: require("./functions.js"),
    lang: require("./locales.js"),

    request: require("request"),
    fs: require("fs")
};


//----------------------------------------------------------------------------//
//                              Connecting the bots                           //
//----------------------------------------------------------------------------//


Client.discord.connect().then(() => {
    Client.twitch.connect()
        .then(() => {
            Client.functions.connectChannels(Client);
        })
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
}).catch(error => {
    console.log(error);
    process.exit(1);
});


//----------------------------------------------------------------------------//
//                       Handle configuration on discord                      //
//----------------------------------------------------------------------------//


Client.discord.on("messageCreate", m => {
    if (m.channel.guild != null && !m.author.bot) {
        Client.db.query("SELECT * FROM global WHERE discordID = ?", [m.channel.guild.id], (error, results) => {
            if (error) console.log(error);
            else if (results[0] != null) {
                let server = results[0],
                    command = m.content.split(" ")[0].toLowerCase().substring(server.prefix.length, m.content.split(" ")[0].length);

                if (["eval", "reason", "log", "prefix", "lang", "twitch", "help", "track"].includes(command) && m.content.toLowerCase().startsWith(server.prefix)) require(`./commands/${command}.js`).exec(Client, m, server);

                if (m.mentions[0] != null) {
                    if (m.mentions[0].id == Client.discord.user.id) Client.functions.getInfo(Client, m, server);
                }
            } else {
                Client.db.query("CREATE TABLE IF NOT EXISTS `" + m.channel.guild.id + "` (msgID varchar(255) NOT NULL,twitchname varchar(255) NOT NULL,modID varchar(255) NOT NULL,reason VARCHAR(255) CHARACTER SET utf8,type varchar(255) NOT NULL,duration varchar(255) NOT NULL,date VARCHAR(255) CHARACTER SET utf8,caseID int NOT NULL AUTO_INCREMENT,PRIMARY KEY(caseID));");
                Client.db.query("INSERT INTO global SET discordID = ?", [m.channel.guild.id]); //Insert into the global settings table.
            }
        });
    } //else Client.functions.sendEmbed("noDM", true, "en", "error", [null, null, null], Client, m);
});


//----------------------------------------------------------------------------//
//                          Log things in the database                        //
//----------------------------------------------------------------------------//


Client.twitch.on("ban", (channel, username, reason) => {
    Client.functions.addLog(channel, username, reason, null, "ban", Client);
});


Client.twitch.on("timeout", (channel, username, reason, duration) => {
    Client.functions.addLog(channel, username, reason, duration, "timeout", Client);
});

Client.twitch.on("notice", (channel, msgid, message) => {
    console.log(channel + " " + msgid + " " + message);
});


//----------------------------------------------------------------------------//
//              Creating table when the bot is added or removed               //
//----------------------------------------------------------------------------//


Client.discord.on("guildCreate", guild => {
    Client.functions.postStats(Client);
    Client.functions.checkServer(guild)
        .then(data => {
            console.log(data);
            Client.db.query("CREATE TABLE IF NOT EXISTS `" + guild.id + "` (msgID varchar(255) NOT NULL,twitchname varchar(255) NOT NULL,modID varchar(255) NOT NULL,reason VARCHAR(255) CHARACTER SET utf8,type varchar(255) NOT NULL,duration varchar(255) NOT NULL,date VARCHAR(255) CHARACTER SET utf8,caseID int NOT NULL AUTO_INCREMENT,PRIMARY KEY(caseID));");
            Client.db.query("INSERT INTO global SET discordID = ?", [guild.id]); //Insert into the global settings table.
            Client.functions.serverAlert(Client, guild, "joined", data.bots, data.admins);
        })
        .catch(data => {
            console.log(data);
            guild.leave();
            Client.functions.serverAlert(Client, guild, "denied", data.bots, null);
        });
});


Client.discord.on("guildDelete", guild => {
    Client.functions.postStats(Client);
    Client.db.query("SELECT * FROM global WHERE discordID = ?", [guild.id], (error, results) => {
        if (error) console.log(error);
        else if (results[0] == null) return;
        else {
            Client.db.query("DELETE FROM global WHERE discordID = ?", [guild.id]);
            Client.db.query("DROP TABLE `" + guild.id + "`"); //Delete the table with the list of bans
            Client.functions.serverAlert(Client, guild, "left", "Unknown", null);
        }
    });
});


//----------------------------------------------------------------------------//
//                     Every disconnected / Debug events                      //
//----------------------------------------------------------------------------//


Client.twitch.on("disconnected", reason => {
    console.log(reason);
    process.exit(1);
});


Client.discord.on("disconnect", () => {
    process.exit(1);
});


Client.discord.on("error", e => {
    console.log(e);
});


Client.discord.on("warn", e => {
    console.log(e);
});


//Force-disconnects everything.


process.on("SIGINT", () => {
    Client.discord.disconnect(false);
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
        exec("git pull", function(error, stdout, stderr) {
            console.log("stdout : " + stdout + "\nstderr :" + stderr);
            if (error !== null) console.log("exec error: " + error);
        });
    }
});

server.listen(1337);
