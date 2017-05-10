const request = require('superagent');
const { CARBON_KEY, DBOTS_KEY } = process.env;

class Stats {
    static dBots(server_count, id) {
        request
            .post(`https://bots.discord.pw/api/bots/${id}/stats`)
            .set({ 'Authorization': DBOTS_KEY })
            .send({ server_count })
            .then(() => console.log('[Carbon] Successfully posted to Carbon.'))
            .catch(err => console.error(`[Carbon] Failed to post to Carbon. ${err}`));
    }

    static carbon(servercount) {
        request
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({ key: CARBON_KEY, servercount })
            .then(() => console.log('[DBots] Successfully posted to DBots.'))
            .catch(err => console.error(`[DBots] Failed to post to DBots. ${err}`));
    }
}

module.exports = Stats;
