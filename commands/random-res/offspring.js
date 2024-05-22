const Command = require('../../framework/Command');
const genders = ['boy', 'girl'];

module.exports = class OffspringCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'offspring',
			aliases: ['sex'],
			group: 'random-res',
			description: 'Determines if your new child will be a boy or a girl.'
		});
	}

	run(msg) {
		return msg.say(`It's a ${genders[Math.floor(Math.random() * genders.length)]}!`);
	}
};
