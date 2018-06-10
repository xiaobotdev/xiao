const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class WikiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikia',
			aliases: ['fandom', 'wikia-article', 'fandom-article'],
			group: 'search',
			memberName: 'wikia',
			description: 'Searches a specific Wikia wiki for your query.',
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

	async run(msg, { wiki, query }) {
		try {
			const search = await request
				.get(`http://${wiki}.wikia.com/api/v1/Search/List/`)
				.query({
					query,
					limit: 1,
					namespaces: 0
				});
			const { body } = await request
				.get(`http://${wiki}.wikia.com/api/v1/Articles/AsSimpleJson/`)
				.query({ id: search.body.items[0].id });
			const data = body.sections[0];
			const embed = new MessageEmbed()
				.setColor(0x002D54)
				.setTitle(data.title)
				.setURL(search.body.items[0].url)
				.setAuthor('Wikia', 'https://i.imgur.com/15A34JT.png', 'http://www.wikia.com/fandom')
				.setDescription(shorten(data.content.map(section => section.text).join('\n\n')))
				.setThumbnail(data.images.length ? data.images[0].src : null);
			return msg.embed(embed);
		} catch (err) {
			return msg.say('Could not find any results.');
		}
	}
};
