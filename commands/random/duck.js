const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'duck',
			aliases: ['ducky'],
			group: 'random',
			memberName: 'duck',
			description: 'Responds with a random duck image.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Random-d.uk',
					url: 'https://random-d.uk/',
					reason: 'API',
					reasonURL: 'https://random-d.uk/api'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://random-d.uk/api/v1/random');
			return msg.say({ files: [body.url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
