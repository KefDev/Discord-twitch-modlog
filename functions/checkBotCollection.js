module.exports = function(guild) {

    let promise = new Promise((resolve, reject) => {

        let counted = 0,
            admins = [],
            bots = 0;

        guild.members.map(member => {
            counted += 1;
            if (member.bot == true) bots += 1;
            if (member.permission.has("manageGuild") == true) admins.push(member.id);
            if (counted == guild.memberCount && bots > guild.memberCount / 2) reject({
                bots: bots,
                admins: admins
            });
            else if (counted == guild.memberCount && bots < guild.memberCount / 2) resolve({
                bots: bots,
                admins: admins
            });
        });
    });
    return promise;
};
