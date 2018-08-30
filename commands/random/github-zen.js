const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GithubZenCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github-zen',
			aliases: ['gh-zen'],
			group: 'random',
			memberName: 'github-zen',
			description: 'Responds with a random GitHub design philosophy.'
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
