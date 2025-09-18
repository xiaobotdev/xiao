const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/cuteness');
const { LOVER_USER_ID } = process.env;

module.exports = class CutenessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cuteness',
			aliases: ['cute'],
			group: 'random-seed',
			description: 'Determines a user\'s cuteness.',
			args: [
				{
					key: 'user',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		const displayName = user.globalName || user.username;
		if (user.id === this.client.user.id) return msg.reply('Me? I think I\'m by far the cutest girl ever!');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('You\'re the most adorable little cutie I know! ❤');
			return msg.reply(`${displayName} is ugly. Like, not cute at all.`);
		}
		if (user.id === LOVER_USER_ID) return msg.reply(`${displayName} is by far the cutest person ever! ❤`);
		const random = MersenneTwister19937.seed(user.id);
		const cuteness = integer(0, texts.length - 1)(random);
		return msg.reply(`${authorUser ? 'You are' : `${displayName} is`} ${texts[cuteness]}`);
	}
};
