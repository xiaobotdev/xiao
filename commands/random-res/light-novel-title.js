const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class LightNovelTitleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'light-novel-title',
			aliases: ['ln-title'],
			group: 'random-res',
			memberName: 'light-novel-title',
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
		try {
			const { text } = await request.get('https://salty-salty-studios.com/shiz/ln.php');
			return msg.say(text.match(/<h1>(.+)<\/h1>/i)[1]);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
