const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class GithubZenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github-zen',
			aliases: ['gh-zen'],
			group: 'random-res',
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
		const { text } = await request.get('https://api.github.com/zen');
		return msg.say(text);
	}
};
