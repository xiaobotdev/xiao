const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const logos = require('../../assets/json/logos');

module.exports = class WikipediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikipedia',
			group: 'search',
			memberName: 'wikipedia',
			description: 'Searches Wikipedia for your query.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'API',
					reasonURL: 'https://en.wikipedia.org/w/api.php'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const { body } = await request
			.get('https://en.wikipedia.org/w/api.php')
			.query({
				action: 'query',
				prop: 'extracts|pageimages|categories|links',
				format: 'json',
				titles: query,
				exintro: '',
				explaintext: '',
				pllimit: 15,
				piprop: 'thumbnail',
				pithumbsize: 1000,
				redirects: '',
				formatversion: 2
			});
		const data = body.query.pages[0];
		if (data.missing) return msg.say('Could not find any results.');
		let thumbnail = data.thumbnail ? data.thumbnail.source : null;
		if (!msg.channel.nsfw && thumbnail) {
			const img = await request.get(thumbnail);
			const nsfw = await this.client.tensorflow.isImageNSFW(img.body);
			if (nsfw) thumbnail = null;
		}
		let fact = data.extract;
		if (fact.length > 200) {
			const facts = fact.split('.');
			fact = `${facts[0]}.`;
			if (fact.length < 200 && facts.length > 1) fact += `${facts[1]}.`;
		}
		const isDisambig = data.categories.some(category => category.title === 'Category:Disambiguation pages');
		if (isDisambig) {
			fact += '\n';
			fact += data.links.filter(link => link.ns === 0).map(link => link.title).join('\n');
			fact += '\n';
		} else {
			fact += ' ';
		}
		const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(query).replaceAll(')', '%29')}`;
		fact += `[Read more...](${url})`;
		const embed = new EmbedBuilder()
			.setColor(0xE7E7E7)
			.setTitle(data.title)
			.setAuthor({ name: 'Wikipedia', iconURL: logos.wikipedia, url: 'https://www.wikipedia.org/' })
			.setURL(url)
			.setThumbnail(thumbnail)
			.setDescription(fact);
		return msg.embed(embed);
	}
};
