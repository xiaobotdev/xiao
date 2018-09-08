const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DuckCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'duck',
			aliases: ['quack', 'ducky'],
			group: 'random',
			memberName: 'duck',
			description: 'Responds with a random duck image.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get('https://api.random-d.uk/random');
			return msg.say({ files: [body.url] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
