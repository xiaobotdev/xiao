const Command = require('../../structures/Command');

module.exports = class RandomUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-user',
			aliases: ['member-roulette', 'user-roulette', 'random-member'],
			group: 'random',
			memberName: 'random-user',
			description: 'Randomly chooses a member of the server.',
			guildOnly: true
		});
	}

	run(msg) {
		return msg.say(`I choose ${msg.guild.members.random().displayName}!`);
	}
};
