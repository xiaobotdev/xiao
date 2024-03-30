const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class BirdCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bird',
			aliases: ['birb'],
			group: 'random-img',
			memberName: 'bird',
			description: 'Responds with a random image of a bird.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'shibe.online',
					url: 'https://shibe.online/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://shibe.online/api/birds')
			.query({
				count: 1,
				urls: true,
				httpsUrls: true
			});
		return msg.say({ files: [body[0]] });
	}
};
