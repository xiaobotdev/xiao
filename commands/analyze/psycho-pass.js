const Command = require('../../structures/Command');
const Random = require('random-js');
const { under100, between, over300 } = require('../../assets/json/psycho-pass');

module.exports = class PsychoPassCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'psycho-pass',
			aliases: ['crime-coefficient'],
			group: 'analyze',
			memberName: 'psycho-pass',
			description: 'Determines your Crime Coefficient.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to determine the Crime Coefficient of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const coefficient = random.integer(0, 500);
		let res;
		if (coefficient < 100) res = under100;
		else if (coefficient > 300) res = over300;
		else res = between;
		return msg.reply(
			`${msg.author.id === user.id ? 'Your' : `Suspect ${user.username}'s`} Crime Coefficient is ${coefficient}. ${res}`
		);
	}
};
