const Command = require('../../structures/Command');

module.exports = class KazumaKazumaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kazuma-kazuma',
			group: 'auto',
			memberName: 'kazuma-kazuma',
			description: 'Hai, Kazuma desu.',
			patterns: [/kazuma,? kazuma!?/i],
			credit: [
				{
					name: 'KONOSUBA -God\'s blessing on this wonderful world!',
					url: 'http://konosuba.com/',
					reason: 'Original Anime'
				}
			]
		});
	}

	run(msg) {
		return msg.say('Hai, Kazuma desu.');
	}
};
