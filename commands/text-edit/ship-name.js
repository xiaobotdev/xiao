const Command = require('../../structures/Command');

module.exports = class ShipNameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship-name',
			group: 'text-edit',
			memberName: 'ship-name',
			description: 'Creates a ship name from two names.',
			args: [
				{
					key: 'start',
					prompt: 'What name should be at the start of the ship name?',
					type: 'string',
					validate: start => {
						if (start.length < 50) return true;
						return 'Invalid start name, the start name must be under 50 characters.';
					},
					parse: start => start.toLowerCase()
				},
				{
					key: 'end',
					prompt: 'What name should be at the end of the ship name?',
					type: 'string',
					validate: end => {
						if (end.length < 50) return true;
						return 'Invalid end name, the end name must be under 50 characters.';
					},
					parse: end => end.toLowerCase()
				}
			]
		});
	}

	run(msg, args) {
		const { start, end } = args;
		return msg.say(`${start.slice(0, Math.floor(start.length / 2))}${end.slice(Math.floor(end.length / 2))}`);
	}
};
