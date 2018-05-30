const Command = require('../../structures/Command');

module.exports = class UserRouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user-roulette',
			aliases: ['member-roulette', 'random-user', 'random-member'],
			group: 'random',
			memberName: 'user-roulette',
			description: 'Randomly chooses a member of the server.',
			guildOnly: true
		});
	}

	run(msg) {
		return msg.say(`I choose ${msg.guild.members.random().displayName}!`);
	}
};
