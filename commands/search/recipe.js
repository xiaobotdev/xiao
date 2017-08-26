const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class RecipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'recipe',
			group: 'search',
			memberName: 'recipe',
			description: 'Searches for recipes that include your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What recipe would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		try {
			const { query } = args;
			const { text } = await snekfetch
				.get('http://www.recipepuppy.com/api/')
				.query({ q: query });
			const body = JSON.parse(text);
			if (!body.results.length) return msg.say('Could not find any results.');
			const recipe = body.results[Math.floor(Math.random() * body.results.length)];
			const embed = new MessageEmbed()
				.setColor(0xC20000)
				.setURL(recipe.href)
				.setTitle(recipe.title)
				.setDescription(`**Ingredients:** ${recipe.ingredients}`)
				.setThumbnail(recipe.thumbnail);
			return msg.embed(embed);
		} catch (err) {
			return msg.say('Could not find any results.');
		}
	}
};
