const Command = require('../../structures/Command');
const RSS = require('rss-parser');
const { stripIndents } = require('common-tags');

module.exports = class TheOnionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'the-onion',
			aliases: ['onion'],
			group: 'random-res',
			memberName: 'the-onion',
			description: 'Responds with a random "The Onion" article.',
			credit: [
				{
					name: 'The Onion',
					url: 'https://www.theonion.com/',
					reason: 'RSS Feed',
					reasonURL: 'https://www.theonion.com/rss'
				}
			]
		});
	}

	async run(msg) {
		const parser = new RSS();
		try {
			const feed = await parser.parseURL('https://www.theonion.com/rss');
			const article = feed.items[Math.floor(Math.random() * feed.items.length)];
			return msg.say(stripIndents`
				${article.title}
				${article.link}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
