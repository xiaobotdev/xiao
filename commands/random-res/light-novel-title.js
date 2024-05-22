const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class LightNovelTitleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'light-novel-title',
			aliases: ['ln-title'],
			group: 'random-res',
			description: 'Responds with a randomly generated Light Novel title.',
			credit: [
				{
					name: 'LN title generator',
					url: 'https://salty-salty-studios.com/shiz/ln.php',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { text } = await request.get('https://salty-salty-studios.com/shiz/ln.php');
		return msg.say(text.match(/<h1>(.+)<\/h1>/i)[1]);
	}
};
