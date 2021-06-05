const Command = require('../../framework/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class IQCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'iq',
			aliases: ['intelligence-quotient'],
			group: 'random-seed',
			memberName: 'iq',
			description: 'Determines a user\'s IQ.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want me to guess the IQ of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		if (user.id === this.client.user.id) return msg.reply('Me? My IQ score is off the charts!');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('Only someone of the highest IQ could make a bot as amazing as me! ❤');
			return msg.reply(`${user.username}, as in my owner? Yeah... Not the sharpest tool in the shed.`);
		}
		const random = MersenneTwister19937.seed(user.id);
		const score = integer(20, 170)(random);
		return msg.reply(`${authorUser ? 'Your' : `${user.username}'s`} IQ score is ${score}.`);
	}
};
