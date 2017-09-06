const Command = require('../../structures/Command');

module.exports = class SlowClapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slow-clap',
			group: 'random',
			memberName: 'slow-clap',
			description: '_slow clap_'
		});
	}

	run(msg) {
		return msg.say('_slow clap_');
	}
};
