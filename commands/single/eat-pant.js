const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const path = require('path');

module.exports = class EatPantCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'eat-pant',
			aliases: ['bort-sampson'],
			group: 'single',
			description: 'Eat pant.',
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			credit: [
				{
					name: '20th Century Fox',
					url: 'https://www.foxmovies.com/',
					reason: 'Original "The Simpsons" Show',
					reasonURL: 'http://www.simpsonsworld.com/'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'eat-pant.png')] });
	}
};
