const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class GhibliCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ghibli',
			aliases: ['studio-ghibli', 'ghibli-person', 'studio-ghibli-person'],
			group: 'search',
			memberName: 'ghibli',
			description: 'Searches Studio Ghibli people for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What person would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('http://ghibliapi.herokuapp.com/people')
				.query({ name: query });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const species = await snekfetch.get(data.species);
			const films = [];
			for (const film of data.films) {
				const movie = await snekfetch.get(film);
				films.push(movie.body);
			}
			const embed = new MessageEmbed()
				.setColor(0xE7E7E7)
				.setAuthor('Studio Ghibli', 'https://i.imgur.com/P3YafQ3.jpg')
				.setTitle(data.name)
				.addField('❯ Gender',
					data.gender || 'N/A', true)
				.addField('❯ Age',
					data.age || 'N/A', true)
				.addField('❯ Species',
					species.body.name || 'N/A', true)
				.addField('❯ Eye Color',
					data.eye_color || 'N/A', true)
				.addField('❯ Hair Color',
					data.hair_color || 'N/A', true)
				.addField('❯ Films',
					films.map(film => film.title).join('\n') || 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
