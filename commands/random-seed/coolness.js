const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/coolness');
const { LOVER_USER_ID } = process.env;

module.exports = class CoolnessCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coolness',
			aliases: ['cool'],
			group: 'random-seed',
			description: 'Determines a user\'s coolness.',
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
		if (user.id === this.client.user.id) return msg.reply('Me? I think I\'m the very best, like no one ever was.');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('You\'re the best owner a bot could ask for! ❤');
			return msg.reply(`Don't tell her I said this but I think ${user.username} smells like a sack of diapers.`);
		}
		if (user.id === LOVER_USER_ID) return msg.reply(`${user.username} is by far the coolest person ever! ❤`);
		const random = MersenneTwister19937.seed(user.id);
		const coolness = integer(0, texts.length - 1)(random);
		return msg.reply(`${authorUser ? 'You are' : `${user.username} is`} ${texts[coolness]}`);
	}
};
