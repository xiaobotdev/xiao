const Command = require('../../framework/Command');
const { IDIOT_URL } = process.env;

module.exports = class IdiotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'idiot',
			aliases: ['moron'],
			group: 'single',
			description: 'Sends a link to an idiot.'
		});
	}

	run(msg) {
		if (!IDIOT_URL) return msg.reply('_Stares at you._');
		return msg.say(IDIOT_URL);
	}
};
