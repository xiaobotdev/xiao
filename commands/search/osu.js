const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { OSU_KEY } = process.env;

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
			aliases: ['osu-user', 'osu-stats'],
			group: 'search',
			memberName: 'osu',
			description: 'Searches osu! usernames for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What user would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://osu.ppy.sh/api/get_user')
				.query({
					k: OSU_KEY,
					u: query,
					type: 'string'
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setColor(0xFF66AA)
				.setAuthor('osu!', 'https://i.imgur.com/hWrw2Sv.png')
				.setURL('https://osu.ppy.sh/')
				.addField('❯ Username',
					data.username, true)
				.addField('❯ ID',
					data.user_id, true)
				.addField('❯ Level',
					data.level || 'N/A', true)
				.addField('❯ Accuracy',
					data.accuracy || 'N/A', true)
				.addField('❯ Rank',
					data.pp_rank || 'N/A', true)
				.addField('❯ Play Count',
					data.playcount || 'N/A', true)
				.addField('❯ Country',
					data.country || 'N/A', true)
				.addField('❯ Ranked Score',
					data.ranked_score || 'N/A', true)
				.addField('❯ Total Score',
					data.total_score || 'N/A', true)
				.addField('❯ SS',
					data.count_rank_ss || 'N/A', true)
				.addField('❯ S',
					data.count_rank_s || 'N/A', true)
				.addField('❯ A',
					data.count_rank_a || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
