const Command = require('../../framework/Command');

module.exports = class RandomUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-user',
			aliases: ['member-roulette', 'user-roulette', 'random-member', 'someone', '@someone'],
			group: 'random-res',
			description: 'Randomly chooses a member of the server.'
		});
	}

	run(msg) {
		let member;
		if (msg.guild) {
			member = msg.guild.members.cache.random().user;
		} else {
			const members = [this.client.user, msg.channel.recipient];
			member = members[Math.floor(Math.random() * members.length)];
		}
		if (member.id === this.client.user.id) return msg.reply('I choose myself!');
		if (member.id === msg.author.id) return msg.reply('I choose you!');
		return msg.reply(`I choose ${member.tag}!`);
	}
};
