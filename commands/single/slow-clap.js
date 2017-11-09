const { Command } = require('discord.js-commando');

module.exports = class SlowClapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slow-clap',
			group: 'single',
			memberName: 'slow-clap',
			description: '_slow clap_'
		});
	}

	run(msg) {
		return msg.say('_slow clap_');
	}
};
