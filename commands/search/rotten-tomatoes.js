const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class RottenTomatoesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rotten-tomatoes',
			aliases: ['tomato-meter'],
			group: 'search',
			memberName: 'rotten-tomatoes',
			description: 'Searches Rotten Tomatoes for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What movie would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://www.rottentomatoes.com/api/private/v2.0/search/')
				.query({
					limit: 10,
					q: query
				});
			if (!body.movies.length) return msg.say('Could not find any results.');
			const data = body.movies.find(movie => movie.name.toLowerCase() === query.toLowerCase()) || body.movies[0];
			const embed = new MessageEmbed()
				.setColor(0xFFEC02)
				.setTitle(data.name)
				.setURL(`https://www.rottentomatoes.com${data.url}`)
				.setAuthor('Rotten Tomatoes', 'https://i.imgur.com/YPRQvX8.jpg')
				.setThumbnail(data.image || null)
				.addField('❯ Tomatometer',
					data.meterScore ? `${data.meterScore}%` : 'N/A', true)
				.addField('❯ Year',
					data.year || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
