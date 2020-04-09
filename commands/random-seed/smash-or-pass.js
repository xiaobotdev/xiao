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
		const random = MersenneTwister19937.seed(user.id);
		const smashOrPass = bool()(random);
		return msg.reply(smashOrPass ? 'Smash, I\'d definitely smash.' : 'Hard pass. Yuck.');
	}
};
