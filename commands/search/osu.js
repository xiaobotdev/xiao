const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class OsuCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'osu',
            aliases: [
                'osuuser',
                'osudata',
                'osuinfo'
            ],
            group: 'search',
            memberName: 'osu',
            description: 'Searches Osu user data. (;osu dragonfire535)',
            examples: [';osu dragonfire535'],
            args: [{
                key: 'username',
                prompt: 'What osu username would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        console.log(`[Command] ${message.content}`);
        const usernameToSearch = args.username;
        try {
            const response = await request
                .get('https://osu.ppy.sh/api/get_user')
                .query({
                    k: process.env.OSU_KEY,
                    u: usernameToSearch,
                    type: 'string'
                });
            const data = response.body[0];
            const embed = new Discord.RichEmbed()
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
        }
        catch (err) {
            return message.say(':x: Error! User not Found!');
        }
    }
};
