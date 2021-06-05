const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class GithubZenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github-zen',
			aliases: ['gh-zen'],
			group: 'random-res',
			memberName: 'github-zen',
			description: 'Responds with a random GitHub design philosophy.',
			credit: [
				{
					name: 'GitHub',
					url: 'https://github.com/',
					reason: 'Zen API',
					reasonURL: 'https://developer.github.com/v3/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('https://api.github.com/zen');
			return msg.say(text);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
