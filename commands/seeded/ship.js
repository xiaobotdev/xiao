const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { oneLine } = require('common-tags');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			group: 'seeded',
			memberName: 'ship',
			description: 'Ships two users together.',
			args: [
				{
					key: 'first',
					label: 'first user',
					prompt: 'Who is the first user in the ship?',
					type: 'user'
				},
				{
					key: 'second',
					label: 'second user',
					prompt: 'Who is the second user in the ship?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { first, second }) {
		if (first.id === second.id) return msg.reply('Shipping someone with themselves would be pretty weird.');
		const authorInvolved = first.id === msg.author.id || second.id === msg.author.id;
		const random = MersenneTwister19937.seed(Math.abs(first.id - second.id));
		const level = integer(0, 100)(random);
		const botText = first.id === this.client.user.id || second.id === this.client.user.id
			? level >= 70
				? `But ${authorInvolved ? 'you\'re' : 'they\'re'} still rejected.`
				: `Haha even a bot thinks ${authorInvolved ? 'you\'re' : 'they\'re'} lame.`
			: '';
		return msg.say(oneLine`
			${first.id === this.client.user.id ? 'Me' : first.id === msg.author.id ? 'You' : first.username} and
			${second.id === this.client.user.id ? 'I' : second.id === msg.author.id ? 'you' : second.username} have a
			compatability of... **${level}%**! ${botText}
		`);
	}
};
