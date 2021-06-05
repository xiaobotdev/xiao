const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class ShibaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shiba',
			aliases: ['shiba-inu', 'shibe', 'shibe-inu', 'doge'],
			group: 'random-img',
			memberName: 'shiba',
			description: 'Responds with a random image of a Shiba Inu.',
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
		try {
			const { body } = await request
				.get('https://shibe.online/api/shibes')
				.query({
					count: 1,
					urls: true,
					httpsUrls: true
				});
			return msg.say({ files: [body[0]] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
