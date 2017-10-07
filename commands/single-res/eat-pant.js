const { Command } = require('discord.js-commando');

module.exports = class EatPantCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eat-pant',
			group: 'single-res',
			memberName: 'eat-pant',
			description: 'eat pant',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: ['https://i.imgur.com/sSmhvxt.jpg'] });
	}
};
