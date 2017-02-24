module.exports = function(Client, user) {

    let promise = new Promise((resolve, reject) => {
        let options = {
            url: "https://api.twitch.tv/v5/users?login=" + user,
            method: "GET",
            headers: {
                "Client-ID": Client.config.twitchAPI
            }
        };
        Client.request(options, (error, response, body) => {
            if (response.statusCode == 200) resolve(JSON.parse(body));
            else reject(JSON.parse(body));
        });

    });

    return promise;
};
