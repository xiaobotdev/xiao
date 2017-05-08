const request = require('superagent');
const { CARBON_KEY, DISCORD_BOTS_KEY } = process.env;

class Stats {
    static discordBots(server_count, userID) {
        return request
            .post(`https://bots.discord.pw/api/bots/${userID}/stats`)
            .set({ 'Authorization': DISCORD_BOTS_KEY })
            .send({ server_count });
    }
    
    static carbon(servercount) {
        return request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({ key: CARBON_KEY, servercount });
    }
}

module.exports = Stats;
