const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class WikipediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikipedia',
			group: 'search',
			memberName: 'wikipedia',
			description: 'Searches Wikipedia for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('https://en.wikipedia.org/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts',
					format: 'json',
					titles: query,
					exintro: '',
					explaintext: '',
					redirects: '',
					formatversion: 2
				});
			if (body.query.pages[0].missing) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xE7E7E7)
				.setTitle(body.query.pages[0].title)
				.setAuthor('Wikipedia', 'https://i.imgur.com/a4eeEhh.png')
				.setDescription(shorten(body.query.pages[0].extract.replace(/\n/g, '\n\n')));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
