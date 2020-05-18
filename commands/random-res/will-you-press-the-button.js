const Command = require('../../structures/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class WillYouPressTheButtonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'will-you-press-the-button',
			aliases: ['press-the-button', 'button', 'wyptb', 'press-button'],
			group: 'random-res',
			memberName: 'will-you-press-the-button',
			description: 'Responds with a random "Will You Press The Button?" dilemma.',
			credit: [
				{
					name: 'Will You Press The Button?',
					url: 'https://willyoupressthebutton.com/',
					reason: 'Dilemma Data'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('https://willyoupressthebutton.com/');
			const $ = cheerio.load(text, { normalizeWhitespace: true });
			const cond = $('div[id="cond"]').first().text().trim();
			const res = $('div[id="res"]').first().text().trim();
			return msg.say(`**${cond}** but **${res}**`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
