const Command = require('../../structures/Command');
const Random = require('random-js');
const { stripIndents } = require('common-tags');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			group: 'analyze',
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
					type: 'user'
				}
			]
		});
	}

	run(msg, { first, second }) {
		if (first.id === second.id) return msg.reply('Shipping someone with themselves would be pretty weird.');
		const random = new Random(Random.engines.mt19937().seed(Math.abs(first.id - second.id)));
		const level = random.integer(0, 100);
		const repeat = Math.floor(level / 5);
		return msg.say(stripIndents`
			${first.username} and ${second.username} have a compatability of... **${level}%**!
			💟 \`[${'■'.repeat(repeat)}${' '.repeat(20 - repeat)}]\` 💟
		`);
	}
};
