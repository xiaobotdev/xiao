const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GooseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'goose',
			aliases: ['geese'],
			group: 'random-img',
			memberName: 'goose',
			description: 'Responds with a random goose image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'nekos.life',
					url: 'https://nekos.life/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://nekos.life/api/v2/img/goose');
			return msg.say({ files: [body.url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
