const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { formatNumber } = require('../../util/Util');

module.exports = class StrainCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'strain',
			aliases: ['weed', 'marijuana', 'cannabis', 'leafly', 'marijuana-strain', 'weed-strain', 'cannabis-strain'],
			group: 'search',
			memberName: 'strain',
			description: 'Responds with information on a cannabis strain.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Leafly',
					url: 'https://www.leafly.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What strain would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const strain = await this.search(query);
			if (!strain) return msg.say('Could not find any results.');
			const effects = Object.values(strain.effects).sort((a, b) => b.score - a.score).slice(0, 3);
			const embed = new MessageEmbed()
				.setColor(0x017C6A)
				.setAuthor('Leafly', 'https://i.imgur.com/KQ0ABhI.png', 'https://www.leafly.com/')
				.setTitle(strain.name)
				.setThumbnail(strain.nugImage || null)
				.setDescription(strain.shortDescriptionPlain || 'No description.')
				.setURL(`https://www.leafly.com/strains/${strain.slug}`)
				.setFooter(strain.subtitle || 'No alternative names.')
				.addField('❯ Effects', effects.map(effect => effect.name).join(', '))
				.addField('❯ Phenotype', strain.phenotype, true)
				.addField('❯ Rating', `${formatNumber(strain.averageRating)} ⭐`, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.get('https://www.leafly.com/search')
			.query({
				q: query,
				searchCategory: 'strain'
			});
		const $ = cheerio.load(text);
		const data = JSON.parse($('script[id="__NEXT_DATA__"]')[0].children[0].data)
			.props
			.initialProps
			.pageProps
			.componentProps
			.searchProps
			.strain;
		if (!data.length) return null;
		return data[0];
	}
};
