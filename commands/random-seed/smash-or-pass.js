const Command = require('../../structures/Command');
const { MersenneTwister19937, bool } = require('random-js');

module.exports = class SmashOrPassCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smash-or-pass',
			aliases: ['pass-or-smash', 'smash-pass', 'pass-smash'],
			group: 'random-seed',
			memberName: 'smash-or-pass',
			description: 'Determines if a user is worthy of a smash or a pass.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to check?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		if (user.id === this.client.user.id) return msg.reply('Obviously smash, Google me.');
		if (this.client.isOwner(user)) {
			if (user.id === msg.author.id) return msg.reply('I mean... Aren\'t we kind of related? In a way?');
			return msg.reply('I sure hope no one is dumb enough to smash that... Thing.');
		}
		const random = MersenneTwister19937.seed(user.id);
		const smashOrPass = bool()(random);
		return msg.reply(smashOrPass ? 'Smash, I\'d definitely smash.' : 'Hard pass. Yuck.');
	}
};
