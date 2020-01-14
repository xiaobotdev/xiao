const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class WikiaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikia',
			aliases: ['fandom'],
			group: 'search',
			memberName: 'wikia',
			description: 'Searches a specific Wikia wiki for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'FANDOM',
					url: 'https://www.fandom.com/',
					reason: 'API',
					reasonURL: 'https://www.wikia.com/api/v1/'
				}
			],
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
			const { id, url } = await this.search(wiki, query);
			const data = await this.fetchArticle(wiki, id);
			const embed = new MessageEmbed()
				.setColor(0x002D54)
				.setTitle(data.title)
				.setURL(url)
				.setAuthor('Wikia', 'https://i.imgur.com/15A34JT.png', 'http://www.wikia.com/fandom')
				.setDescription(shorten(data.content.map(section => section.text).join('\n\n')))
				.setThumbnail(data.images.length ? data.images[0].src : null);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Perhaps you entered an invalid wiki?`);
		}
	}

	async search(wiki, query) {
		const { body } = await request
			.get(`https://${wiki}.wikia.com/api/v1/Search/List/`)
			.query({
				query,
				limit: 1,
				namespaces: 0
			});
		const data = body.items[0];
		return { id: data.id, url: data.url };
	}

	async fetchArticle(wiki, id) {
		const { body } = await request
			.get(`https://${wiki}.wikia.com/api/v1/Articles/AsSimpleJson/`)
			.query({ id });
		return body.sections[0];
	}
};
