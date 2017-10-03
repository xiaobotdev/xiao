const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { QUIZLET_KEY } = process.env;

module.exports = class QuizletCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quizlet',
			aliases: ['quizlet-set'],
			group: 'search',
			memberName: 'quizlet',
			description: 'Searches Quizlet for study sets.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What study set would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api.quizlet.com/2.0/search/sets')
				.query({
					q: query,
					client_id: QUIZLET_KEY
				});
			if (!body.sets.length) return msg.say('Could not find any results.');
			const data = body.sets[0];
			const embed = new MessageEmbed()
				.setAuthor('Quizlet', 'https://i.imgur.com/mUvSPJn.png')
				.setColor(0x4257B2)
				.setURL(data.url)
				.setTitle(data.title)
				.addField('❯ Creator',
					data.created_by, true)
				.addField('❯ ID',
					data.id, true)
				.addField('❯ Term Count',
					data.term_count, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
