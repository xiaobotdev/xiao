const snekfetch = require('snekfetch');
const { CARBON_KEY, DBOTS_KEY } = process.env;

class Stats {
    static dBots(count, id) {
        snekfetch
            .post(`https://bots.discord.pw/api/bots/${id}/stats`)
            .set({ Authorization: DBOTS_KEY })
            .send({ server_count: count })
            .then(() => console.log('[CARBON] Successfully posted to Carbon.'))
            .catch((err) => console.error(`[CARBON] Failed to post to Carbon. ${err}`));
    }

    static carbon(count) {
        snekfetch
            .post('https://www.carbonitex.net/discord/data/botdata.php')
            .send({
                key: CARBON_KEY,
                servercount: count
            })
            .then(() => console.log('[DBOTS] Successfully posted to Discord Bots.'))
            .catch((err) => console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`));
    }
}

module.exports = Stats;
