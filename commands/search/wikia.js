const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class WikiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikia',
			aliases: ['fandom'],
			group: 'search',
			memberName: 'wikia',
			description: 'Searches a specified Wikia wiki for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'wiki',
					prompt: 'What is the subdomain of the wiki you want to search?',
					type: 'string',
					parse: wiki => encodeURIComponent(wiki)
				},
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { wiki, query } = args;
		try {
			const search = await snekfetch
				.get(`http://${wiki}.wikia.com/api/v1/Search/List/`)
				.query({
					query,
					limit: 1,
					namespaces: 0
				});
			const { body } = await snekfetch
				.get(`http://${wiki}.wikia.com/api/v1/Articles/AsSimpleJson/`)
				.query({ id: search.body.items[0].id });
			const embed = new MessageEmbed()
				.setColor(0x002D54)
				.setTitle(body.sections[0].title)
				.setURL(search.body.items[0].url)
				.setAuthor('Wikia', 'https://i.imgur.com/WzXWJka.png')
				.setDescription(shorten(body.sections[0].content.map(section => section.text).join('\n\n')))
				.setThumbnail(body.sections[0].images.length ? body.sections[0].images[0].src : null);
			return msg.embed(embed);
		} catch (err) {
			return msg.say('Could not find any results.');
		}
	}
};
