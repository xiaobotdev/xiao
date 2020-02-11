const Command = require('../../structures/Command');

module.exports = class RandomUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-user',
			aliases: ['member-roulette', 'user-roulette', 'random-member', 'someone', '@someone'],
			group: 'random',
			memberName: 'random-user',
			description: 'Randomly chooses a member of the server.'
		});
	}

	run(msg) {
		if (msg.channel.type === 'dm') {
			const members = [this.client.user, msg.channel.recipient];
			return msg.say(`I choose ${members[Math.floor(Math.random() * members.length)].username}!`);
		}
		return msg.say(`I choose ${msg.guild.members.cache.random().displayName}!`);
	}
};
