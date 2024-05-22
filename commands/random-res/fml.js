const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class FmlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fml',
			aliases: ['fuck-my-life', 'f-my-life'],
			group: 'random-res',
			description: 'Responds with a FML quote.',
			nsfw: true,
			credit: [
				{
					name: 'FML',
					url: 'https://www.fmylife.com/',
					reason: 'FML Data'
				}
			]
		});
	}

	async run(msg) {
		const { text } = await request.get('http://www.fmylife.com/random');
		const $ = cheerio.load(text, { normalizeWhitespace: true });
		const fml = $('a.block').first().text().trim();
		return msg.say(fml);
	}
};
