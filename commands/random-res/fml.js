const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class FmlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fml',
			aliases: ['fuck-my-life', 'f-my-life'],
			group: 'random-res',
			memberName: 'fml',
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
		try {
			const { text } = await request.get('http://www.fmylife.com/random');
			const $ = cheerio.load(text, { normalizeWhitespace: true });
			const fml = $('a.article-link').first().text().trim();
			return msg.say(fml);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
