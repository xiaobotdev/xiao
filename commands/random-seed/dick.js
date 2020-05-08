const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class DickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dick',
			aliases: ['dick-size', 'penis', 'penis-size', 'pee-pee', 'pee-pee-size', 'cock', 'cock-size'],
			group: 'random-seed',
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
		if (this.client.isOwner(user)) {
			if (user.id === msg.author.id) return msg.reply(`8${'='.repeat(20)}D`);
			return msg.reply(`8=D`);
		}
		const clientAuthor = user.id === this.client.user.id;
		const random = MersenneTwister19937.seed(clientAuthor ? msg.author.id : user.id);
		const length = integer(0, 20)(random);
		return msg.reply(`8${'='.repeat(clientAuthor ? length + 1 : length)}D`);
	}
};
