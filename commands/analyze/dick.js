const Command = require('../../structures/Command');
const Random = require('random-js');

module.exports = class DickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dick',
			aliases: ['dick-size', 'penis', 'penis-size', 'pee-pee', 'pee-pee-size'],
			group: 'analyze',
			memberName: 'dick',
			description: 'Determines your dick size.',
			nsfw: true,
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to determine the dick size of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const random = new Random(Random.engines.mt19937().seed(user.id));
		const length = random.integer(0, 200);
		return msg.reply(`8${'='.repeat(user.id === this.client.user.id ? length + 1 : length)}D`);
	}
};
