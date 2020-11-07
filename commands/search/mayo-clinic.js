const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
const { shorten } = require('../../util/Util');

module.exports = class MayoClinicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mayo-clinic',
			aliases: ['disease'],
			group: 'search',
			memberName: 'mayo-clinic',
			description: 'Searches Mayo Clinic for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Mayo Clinic',
					url: 'https://www.mayoclinic.org/',
					reason: 'Disease Data'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What disease would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const location = await this.search(query);
			if (!location) return msg.say('Could not find any results.');
			const data = await this.fetchDisease(location);
			if (typeof data === 'string') return msg.say(`I found a match, but it's not a disease: ${data}`);
			const embed = new MessageEmbed()
				.setColor(0x0044B3)
				.setAuthor('Mayo Clinic', 'https://i.imgur.com/9zdulOS.jpg', 'https://www.mayoclinic.org/')
				.setTitle(data.name)
				.setDescription(shorten(data.description || 'No description available.'))
				.setURL(data.url);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.get('https://www.mayoclinic.org/search/search-results')
			.query({ q: query });
		const $ = cheerio.load(text);
		const location = $('ol.navlist').find('li.noimg').first().children().find('a').attr('href');
		if (!location) return null;
		return location;
	}

	async fetchDisease(location) {
		const { text } = await request.get(location);
		const $ = cheerio.load(text);
		const header = $('h2').first();
		if (header.text() === 'Overview') {
			return {
				name: $('h1').first().text().trim(),
				url: location,
				description: $('p').eq(1).text().trim()
			};
		}
		return location;
	}
};
