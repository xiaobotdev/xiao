const { Command } = require('discord.js-commando');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			group: 'random-res',
			memberName: 'ship',
			description: 'Ships things/people together.',
			args: [
				{
					key: 'thing1',
					label: 'first name',
					prompt: 'Who is the first person in the ship?',
					type: 'string',
					max: 500
				},
				{
					key: 'thing2',
					label: 'second name',
					prompt: 'Who is the second person in the ship?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { thing1, thing2 }) {
		return msg.say(`I'd give ${thing1} and ${thing2} a ${Math.floor(Math.random() * 100) + 1}%!`);
	}
};
