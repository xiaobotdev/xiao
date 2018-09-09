const Command = require('../../structures/Command');
const path = require('path');

module.exports = class EatPantCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eat-pant',
			group: 'single',
			memberName: 'eat-pant',
			description: 'Eat pant.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'eat-pant.png')] });
	}
};
