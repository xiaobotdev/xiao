const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class InspirationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'inspiration',
			aliases: ['inspire', 'inspirobot'],
			group: 'random-img',
			memberName: 'inspiration',
			description: 'Responds with a randomly generated inspiration.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'InspiroBot',
					url: 'https://inspirobot.me/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request
				.get('https://inspirobot.me/api')
				.query({ generate: true });
			return msg.say({ files: [text] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
