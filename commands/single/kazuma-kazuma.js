const Command = require('../../structures/Command');

module.exports = class KazumaKazumaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kazuma-kazuma',
			group: 'single',
			memberName: 'kazuma-kazuma',
			description: 'Hai, Kazuma desu.',
			patterns: [/kazuma,? kazuma!?/i]
		});
	}

	run(msg) {
		return msg.say('Hai, Kazuma desu.');
	}
};
