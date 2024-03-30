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
		const { text } = await request
			.get('https://inspirobot.me/api')
			.query({ generate: true });
		return msg.say({ files: [text] });
	}
};
