const request = require('superagent');

module.exports = class Stats {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
    
    static discordBots(count, userID) {
        return request
            .post(`https://bots.discord.pw/api/bots/${userID}/stats`)
            .set({
                'Authorization': process.env.DISCORD_BOTS_KEY
            })
            .send({
                server_count: count
            });
    }
    
    static carbon(count) {
        return request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: process.env.CARBON_KEY,
                servercount: count
            });
    }
};
