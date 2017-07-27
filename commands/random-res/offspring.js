const Command = require('../../structures/Command');
const genders = ['boy', 'girl'];

module.exports = class OffspringCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'offspring',
			group: 'random-res',
			memberName: 'offspring',
			description: 'Decides if your new child will be a boy or a girl.'
		});
	}

	run(msg) {
		const gender = genders[Math.floor(Math.random() * genders.length)];
		return msg.say(`It's a ${gender}!`);
	}
};
