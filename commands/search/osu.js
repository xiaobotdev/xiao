const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { OSU_KEY } = process.env;

module.exports = class OsuCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'osu',
            group: 'search',
            memberName: 'osu',
            description: 'Searches Osu! user data.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What osu username would you like to search for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get('https://osu.ppy.sh/api/get_user')
            .query({
                k: OSU_KEY,
                u: query,
                type: 'string'
            });
        if (!body.length) return msg.say('No Results.');
        const embed = new RichEmbed()
            .setColor(0xFF66AA)
            .setAuthor('osu!', 'https://i.imgur.com/EmnUp00.png')
            .setURL('https://osu.ppy.sh/')
            .addField('❯ Username',
                body[0].username, true)
            .addField('❯ ID',
                body[0].user_id, true)
            .addField('❯ Level',
                body[0].level, true)
            .addField('❯ Accuracy',
                body[0].accuracy, true)
            .addField('❯ Rank',
                body[0].pp_rank, true)
            .addField('❯ Play Count',
                body[0].playcount, true)
            .addField('❯ Country',
                body[0].country, true)
            .addField('❯ Ranked Score',
                body[0].ranked_score, true)
            .addField('❯ Total Score',
                body[0].total_score, true)
            .addField('❯ SS',
                body[0].count_rank_ss, true)
            .addField('❯ S',
                body[0].count_rank_s, true)
            .addField('❯ A',
                body[0].count_rank_a, true);
        return msg.embed(embed);
    }
};
