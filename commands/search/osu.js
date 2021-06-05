const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { formatNumber } = require('../../util/Util');
const { OSU_KEY } = process.env;

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			group: 'search',
			memberName: 'osu',
			description: 'Responds with information on an osu! user.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'osu!',
					url: 'https://osu.ppy.sh/home',
					reason: 'API',
					reasonURL: 'https://github.com/ppy/osu-api/wiki'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { user }) {
		try {
			const { body } = await request
				.get('https://osu.ppy.sh/api/get_user')
				.query({
					k: OSU_KEY,
					u: user,
					type: 'string'
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setColor(0xFF66AA)
				.setAuthor('osu!', 'https://i.imgur.com/hWrw2Sv.png', 'https://osu.ppy.sh/')
				.addField('❯ Username', data.username, true)
				.addField('❯ ID', data.user_id, true)
				.addField('❯ Level', data.level || '???', true)
				.addField('❯ Accuracy', data.accuracy ? `${Math.round(data.accuracy)}%` : '???', true)
				.addField('❯ Rank', data.pp_rank ? formatNumber(data.pp_rank) : '???', true)
				.addField('❯ Play Count', data.playcount ? formatNumber(data.playcount) : '???', true)
				.addField('❯ Country', data.country || '???', true)
				.addField('❯ Ranked Score', data.ranked_score ? formatNumber(data.ranked_score) : '???', true)
				.addField('❯ Total Score', data.total_score ? formatNumber(data.total_score) : '???', true)
				.addField('❯ SS', data.count_rank_ss ? formatNumber(data.count_rank_ss) : '???', true)
				.addField('❯ S', data.count_rank_s ? formatNumber(data.count_rank_s) : '???', true)
				.addField('❯ A', data.count_rank_a ? formatNumber(data.count_rank_a) : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
