const request = require('superagent');

module.exports.discordBots = async(count, userID) => {
    const { body } = await request
        .post(`https://bots.discord.pw/api/bots/${userID}/stats`)
        .set({
            'Authorization': process.env.DISCORD_BOTS_KEY
        })
        .send({
            server_count: count
        });
    return body.stats[0].server_count;
};

module.exports.carbon = (count) => {
    const { text } = await request
        .post('https://www.carbonitex.net/discord/data/botdata.php')
        .send({
            key: process.env.CARBON_KEY,
            servercount: count
        });
    return text;
};
