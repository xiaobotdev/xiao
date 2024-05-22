const Command = require('../../framework/Command');

module.exports = class HiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hi',
			aliases: ['hello', 'hey', 'hoi', 'hola'],
			group: 'single',
			description: 'Hello.'
		});
	}

	async run(msg) {
		try {
			await msg.react('👋');
			return null;
		} catch {
			return msg.reply('Hi there!');
		}
	}
};
