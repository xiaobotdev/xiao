const { Command } = require('discord.js-commando');
const pikachus = require('../../assets/json/pikachu');

module.exports = class PikachuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pikachu',
			aliases: ['pika'],
			group: 'random-res',
			memberName: 'pikachu',
			description: 'Responds with a random image of Pikachu.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [pikachus[Math.floor(Math.random() * pikachus.length)]] });
	}
};
