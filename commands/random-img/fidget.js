const Command = require('../../structures/Command');
const nimbats = require('../../assets/json/fidget');

module.exports = class FidgetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fidget',
			aliases: ['nimbat'],
			group: 'random-img',
			memberName: 'fidget',
			description: 'Responds with a random image of Fidget.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [nimbats[Math.floor(Math.random() * nimbats.length)]] });
	}
};
