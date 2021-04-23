const Command = require('../../structures/Command');
const affirmations = require('../../assets/json/affirmation');

module.exports = class AffirmationCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'affirmation',
			group: 'random-res',
			memberName: 'affirmation',
			description: 'Responds with a random affirmation.',
			credit: [
				{
					name: 'Tilde Ann Thurium',
					url: 'https://github.com/annthurium',
					reason: 'Affirmations Data',
					reasonURL: 'https://github.com/annthurium/affirmations/blob/master/affirmations.js'
				}
			]
		});
	}

	run(msg) {
		return msg.say(affirmations[Math.floor(Math.random() * affirmations.length)]);
	}
};
