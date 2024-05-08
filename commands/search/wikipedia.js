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
				prop: 'extracts|pageimages',
				format: 'json',
				titles: query,
				exintro: '',
				explaintext: '',
				piprop: 'original',
				redirects: '',
				formatversion: 2
			});
		const data = body.query.pages[0];
		if (data.missing) return msg.say('Could not find any results.');
		let thumbnail = data.original ? data.original.source : null;
		if (!msg.channel.nsfw && thumbnail) {
			const img = await request.get(data.original.source);
			const nsfw = await this.client.tensorflow.isImageNSFW(img.body);
			if (nsfw) thumbnail = null;
		}
		let fact = data.extract;
		if (fact.length > 200) {
			const facts = fact.split('.');
			fact = `${facts[0]}.`;
			if (fact.length < 200 && facts.length > 1) fact += `${facts[1]}.`;
		}
		const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(query).replaceAll(')', '%29')}`;
		const embed = new EmbedBuilder()
			.setColor(0xE7E7E7)
			.setTitle(data.title)
			.setAuthor({ name: 'Wikipedia', iconURL: logos.wikipedia, url: 'https://www.wikipedia.org/' })
			.setURL(url)
			.setThumbnail(thumbnail)
			.setDescription(`${fact} [Read more...](${url})`);
		return msg.embed(embed);
	}
};
