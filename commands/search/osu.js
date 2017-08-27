const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { OSU_KEY } = process.env;

module.exports = class OsuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'osu',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('https://osu.ppy.sh/api/get_user')
				.query({
					k: OSU_KEY,
					u: query,
					type: 'string'
				});
			if (!body.length) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xFF66AA)
				.setAuthor('osu!', 'https://i.imgur.com/EmnUp00.png')
				.setURL('https://osu.ppy.sh/')
				.addField('❯ Username',
					body[0].username, true)
				.addField('❯ ID',
					body[0].user_id, true)
				.addField('❯ Level',
					body[0].level || 'N/A', true)
				.addField('❯ Accuracy',
					body[0].accuracy || 'N/A', true)
				.addField('❯ Rank',
					body[0].pp_rank || 'N/A', true)
				.addField('❯ Play Count',
					body[0].playcount || 'N/A', true)
				.addField('❯ Country',
					body[0].country || 'N/A', true)
				.addField('❯ Ranked Score',
					body[0].ranked_score || 'N/A', true)
				.addField('❯ Total Score',
					body[0].total_score || 'N/A', true)
				.addField('❯ SS',
					body[0].count_rank_ss || 'N/A', true)
				.addField('❯ S',
					body[0].count_rank_s || 'N/A', true)
				.addField('❯ A',
					body[0].count_rank_a || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
