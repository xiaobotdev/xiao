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
					name: 'u/_Ebb',
					url: 'https://www.reddit.com/user/_Ebb',
					reason: 'Image',
					reasonURL: 'https://www.reddit.com/r/Ooer/comments/52z589/eat_pant_maaaaaaaan/'
				},
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
