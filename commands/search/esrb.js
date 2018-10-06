const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');
const ratings = {
	EC: 'Early Childhood',
	E: 'Everyone',
	E10plus: 'Everyone 10+',
	T: 'Teen',
	M: 'Mature',
	AO: 'Adults Only'
};

module.exports = class ESRBCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'esrb',
			aliases: ['esrb-rating'],
			group: 'search',
			memberName: 'esrb',
			description: 'Searches ESRB for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What game would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const data = await this.search(query);
			if (!data) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x231F20)
				.setAuthor('ESRB', 'https://i.imgur.com/dV2BamF.jpg', 'https://www.esrb.org/')
				.setTitle(`${data.title} (${data.platforms.join(', ')})`)
				.setDescription(data.summary || 'No summary available.')
				.setThumbnail(data.image)
				.addField('❯ Rating', ratings[data.rating], true)
				.addField('❯ Content Descriptors', data.descriptors.length ? data.descriptors.join('\n') : 'None', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.get('https://www.esrb.org/ratings/search.aspx')
			.query({
				from: 'home',
				titleOrPublisher: query
			});
		const $ = cheerio.load(text);
		const result = $('table').first().children().eq(1).children();
		if (!result.length) return null;
		const image = result.find('td[data-title="Ratings"]').first().find('img').attr('src');
		const descriptors = result.find('td[data-title="Content Descriptors"]').first().children().first().text().trim();
		return {
			title: result.find('td[data-title="Title"]').first().text().trim(),
			platforms: result.find('td[data-title="Platforms"]').first().text().trim().split(', '),
			rating: image.match(/(EC|E|E10plus|T|M|AO)\.png/i)[1],
			descriptors: descriptors.split(', '),
			summary: result.find('td[style="border-width: 0 3px 0 0; padding: 10px;"]').first().text().trim() || null,
			image
		};
	}
};
