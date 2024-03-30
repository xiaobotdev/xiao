const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { formatNumber } = require('../../util/Util');
const { LOVER_USER_ID } = process.env;

module.exports = class WorthCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'worth',
			aliases: ['self-worth'],
			group: 'random-seed',
			memberName: 'worth',
			description: 'Determines how much a user is worth.',
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			],
			credit: [
				{
					name: 'AzuraApple',
					url: 'https://github.com/AzuraApple',
					reason: 'Concept'
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		if (user.id === this.client.user.id) return msg.reply('Me? I\'m worth $5/month. At least that\'s how much I cost.');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('Infinity, you amazing owner! ❤');
			return msg.reply(`${user.username}, as in my owner? Worthless. Absolutely worthless.`);
		}
		if (user.id === LOVER_USER_ID) {
			return msg.reply(`${user.username} is worth more than anyone else on this Earth! ❤`);
		}
		const random = MersenneTwister19937.seed(user.id);
		const worth = integer(0, 1000000)(random);
		return msg.reply(`${authorUser ? 'You are' : `${user.username} is`} worth $${formatNumber(worth)}.`);
	}
};
