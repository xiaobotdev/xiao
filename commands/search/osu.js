const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class OsuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'osu',
            group: 'search',
            memberName: 'osu',
            description: 'Searches Osu! user data.',
            args: [
                {
                    key: 'query',
                    prompt: 'What osu username would you like to search for?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://osu.ppy.sh/api/get_user?k=${process.env.OSU_KEY}&u=${query}&type=string`);
            if (body.length === 0) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0xFF66AA)
                .setAuthor('osu!', 'https://i.imgur.com/EmnUp00.png')
                .setURL('https://osu.ppy.sh/')
                .addField('**Username:**',
                    body[0].username, true)
                .addField('**ID:**',
                    body[0].user_id, true)
                .addField('**Level:**',
                    body[0].level, true)
                .addField('**Accuracy**',
                    body[0].accuracy, true)
                .addField('**Rank:**',
                    body[0].pp_rank, true)
                .addField('**Play Count:**',
                    body[0].playcount, true)
                .addField('**Country:**',
                    body[0].country, true)
                .addField('**Ranked Score:**',
                    body[0].ranked_score, true)
                .addField('**Total Score:**',
                    body[0].total_score, true)
                .addField('**SS:**',
                    body[0].count_rank_ss, true)
                .addField('**S:**',
                    body[0].count_rank_s, true)
                .addField('**A:**',
                    body[0].count_rank_a, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`An Error Occurred: ${err}`);
        }
    }
};
