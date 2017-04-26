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
            args: [{
                key: 'username',
                prompt: 'What osu username would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { username } = args;
        try {
            const { body } = await request
                .get(`https://osu.ppy.sh/api/get_user?k=${process.env.OSU_KEY}&u=${username}&type=string`);
            const data = body[0];
            const embed = new RichEmbed()
                .setColor(0xFF66AA)
                .setAuthor('osu!', 'http://vignette3.wikia.nocookie.net/osugame/images/c/c9/Logo.png/revision/latest?cb=20151219073209')
                .setURL('https://osu.ppy.sh/')
                .addField('**Username:**',
                    data.username, true)
                .addField('**ID:**',
                    data.user_id, true)
                .addField('**Level:**',
                    data.level, true)
                .addField('**Accuracy**',
                    data.accuracy, true)
                .addField('**Rank:**',
                    data.pp_rank, true)
                .addField('**Play Count:**',
                    data.playcount, true)
                .addField('**Country:**',
                    data.country, true)
                .addField('**Ranked Score:**',
                    data.ranked_score, true)
                .addField('**Total Score:**',
                    data.total_score, true)
                .addField('**SS:**',
                    data.count_rank_ss, true)
                .addField('**S:**',
                    data.count_rank_s, true)
                .addField('**A:**',
                    data.count_rank_a, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The user may not have been found.');
        }
    }
};
