const Command = require('../../structures/Command');
const puns = require('../../assets/json/pun');

module.exports = class PunCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pun',
			group: 'random',
			memberName: 'pun',
			description: 'Responds with a random pun.'
		});
	}

	run(msg) {
		return msg.say(puns[Math.floor(Math.random() * puns.length)]);
	}
};
