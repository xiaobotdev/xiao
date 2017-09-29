const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class StudioGhibliCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'studio-ghibli',
			aliases: ['ghibli', 'ghibli-film', 'studio-ghibli-film'],
			group: 'search',
			memberName: 'studio-ghibli',
			description: 'Searches Studio Ghibli films for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What film would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('http://ghibliapi.herokuapp.com/films')
				.query({ title: query });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setColor(0xE7E7E7)
				.setAuthor('Studio Ghibli', 'https://i.imgur.com/fQvw2B8.jpg')
				.setTitle(data.title)
				.setDescription(shorten(data.description))
				.addField('❯ Release Year',
					data.release_date || 'N/A', true)
				.addField('❯ Director',
					data.director || 'N/A', true)
				.addField('❯ Rotten Tomatoes Score',
					data.rt_score ? `${data.rt_score}%` : 'N/A', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
