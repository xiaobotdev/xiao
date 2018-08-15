const Command = require('../../structures/Command');
const Random = require('random-js');

module.exports = class DickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dick',
			aliases: ['dick-size'],
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
		return msg.reply(`8${'='.repeat(random.integer(0, 200))}D`);
	}
};
