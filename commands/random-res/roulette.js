const Command = require('../../structures/Command');

module.exports = class RouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roulette',
			group: 'random-res',
			memberName: 'roulette',
			description: 'Chooses a random member of the server.',
			guildOnly: true
		});
	}

	run(msg) {
		return msg.say(`I choose ${msg.guild.members.random().displayName}!`);
	}
};
