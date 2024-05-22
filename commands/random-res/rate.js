const Command = require('../../framework/Command');

module.exports = class RateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rate',
			aliases: ['rate-waifu'],
			group: 'random-res',
			description: 'Rates something.',
			args: [
				{
					key: 'thing',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { thing }) {
		return msg.say(`I'd give ${thing} a ${Math.floor(Math.random() * 10) + 1}/10!`);
	}
};
