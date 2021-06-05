const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class AnimeFigureCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-figure',
			aliases: ['my-figure-collection', 'mfc', 'figure'],
			group: 'search',
			memberName: 'anime-figure',
			description: 'Searches MyFigureCollection for your query.',
			credit: [
				{
					name: 'MyFigureCollection.net',
					url: 'https://myfigurecollection.net/',
					reason: 'Figure Data'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What figure would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const location = await this.search(query);
			if (!location) return msg.say('Could not find any results.');
			return msg.say(location);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.get('https://myfigurecollection.net/browse.v4.php')
			.query({ keywords: query });
		const $ = cheerio.load(text);
		const location = $('span[class="item-icon"]').first().children().first().attr('href');
		if (!location) return null;
		return `https://myfigurecollection.net${location}`;
	}
};
