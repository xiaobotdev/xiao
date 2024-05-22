const Command = require('../../framework/Command');

module.exports = class BubbleWrapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bubble-wrap',
			group: 'games-sp',
			description: 'Pop some bubble wrap.',
			args: [
				{
					key: 'amount',
					type: 'integer',
					default: 156,
					min: 1,
					max: 250
				}
			]
		});
	}

	run(msg, { amount }) {
		return msg.say(new Array(amount).fill('||POP||').join(' '));
	}
};
