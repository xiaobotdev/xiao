const { Command } = require('discord.js-commando');
const levels = require('../../assets/json/coolness');

module.exports = class CoolnessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coolness',
			group: 'analyze',
			memberName: 'coolness',
			description: 'Determines a user\'s coolness.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to determine the coolness of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const coolness = Math.round(((user.id / this.client.user.id) * 10) / 2);
		if (user.id === this.client.user.id) return msg.say('Me? I think I\'m the very best, like no one ever was.');
		if (this.client.isOwner(user)) {
			if (this.client.isOwner(msg.author)) {
				return msg.say(`${user.username}, you're the best owner a bot could ask for! ❤`);
			}
			return msg.say(`Don't tell them I said this but I think ${user.username} ${levels[levels.length - 1]}`);
		}
		return msg.say(`${user.username} ${levels[Math.min(coolness, levels.length - 1)]}`);
	}
};
