const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class IQCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'iq',
			aliases: ['intelligence-quotient'],
			group: 'seeded',
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
		if (user.id === this.client.user.id) return msg.reply('Me? My IQ score is off the charts!');
		const random = MersenneTwister19937.seed(user.id);
		const score = integer(20, 170)(random);
		return msg.reply(`${user.id === msg.author.id ? 'Your' : `${user.username}'s`} IQ score is ${score}.`);
	}
};
