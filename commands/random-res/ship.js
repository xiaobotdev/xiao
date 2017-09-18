const Command = require('../../structures/Command');
const { list } = require('../../structures/Util');

module.exports = class ShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ship',
			aliases: ['rate'],
			group: 'random-res',
			memberName: 'ship',
			description: 'Ships things/people together.',
			args: [
				{
					key: 'things',
					prompt: 'What do you want to ship together?',
					type: 'string',
					infinite: true
				}
			]
		});
	}

	run(msg, { things }) {
		return msg.say(`I'd give ${list(things)} a ${Math.floor(Math.random() * 100) + 1}%!`);
	}
};
