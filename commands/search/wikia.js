const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

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
				.setAuthor('FANDOM', 'https://i.imgur.com/15A34JT.png', 'https://www.fandom.com/')
				.setDescription(data.abstract)
				.setThumbnail(data.thumbnail);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Perhaps you entered an invalid wiki?`);
		}
	}

	async search(wiki, query) {
		const data = await request
			.get(`https://${wiki}.fandom.com/api.php`)
			.query({
				action: 'query',
				titles: query,
				redirects: '',
				format: 'json',
				formatversion: 2
			});
		return { id: data.body.query.pages[0].pageid, url: data.url };
	}

	async fetchArticle(wiki, id) {
		const { body } = await request
			.get(`https://${wiki}.fandom.com/api/v1/Articles/Details`)
			.query({
				ids: id,
				abstract: 500
			});
		return body.items[id.toString()];
	}
};
