const Command = require('../../structures/Command');
const Random = require('random-js');

module.exports = class IQCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'iq',
			aliases: ['intelligence-quotient'],
			group: 'analyze',
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
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const score = random.integer(20, 170);
		return msg.reply(`${user.id === msg.author.id ? 'Your' : `${user.username}'s`} IQ score is ${score}.`);
	}
};
