module.exports = function(guild) {

    let promise = new Promise((resolve, reject) => {

        let counted = 0,
            admins = [],
            bots = 0;

        guild.members.map(member => {
            counted += 1;
            if (member.bot == true) bots += 1;
            if (member.permission.has("manageGuild") == true) admins.push(member.id);
            let object = {
                bots: bots,
                admins: admins
            };
            if (counted == guild.memberCount && bots > guild.memberCount / 2) reject(object);
            else if (counted == guild.memberCount && bots < guild.memberCount / 2) resolve(object);
        });
    });
    return promise;
};
