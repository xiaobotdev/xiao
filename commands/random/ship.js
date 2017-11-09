const { Command } = require('discord.js-commando');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			group: 'random',
			memberName: 'ship',
			description: 'Ships two people together.',
			args: [
				{
					key: 'first',
					label: 'first name',
					prompt: 'Who is the first person in the ship?',
					type: 'string',
					max: 500
				},
				{
					key: 'second',
					label: 'second name',
					prompt: 'Who is the second person in the ship?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	run(msg, { first, second }) {
		return msg.say(`I'd give ${first} and ${second} a ${Math.floor(Math.random() * 100) + 1}%!`);
	}
};
