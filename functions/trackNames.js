module.exports = function(Client, user) {

    let promise = new Promise((resolve, reject) => {
        let options = {
            url: "http://equinox.ovh:3000/api/name/" + user.toLowerCase(),
            method: "GET",
            headers: {
                "Client-ID": Client.config.twitchAPI
            }
        };
        Client.request(options, (error, response, body) => {
            if (response.statusCode == 200) {
                let data = JSON.parse(body);
                if (data.names[1] == ",") data.names = data.names.substring(1, data.names.length);
                data.names = data.names.replace(/[,]/g, "\n");
                resolve(data);
            } else reject(JSON.parse(body));
        });

    });

    return promise;
};
