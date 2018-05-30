const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class NitroCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nitro',
			aliases: ['discord-nitro', 'nitro-message', 'nitro-msg'],
			group: 'single',
			memberName: 'nitro',
			description: 'Sends the "This message can only be viewed by users with Discord Nitro." message.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setAuthor('Discord Nitro', 'https://i.imgur.com/DKaY8fV.jpg', 'https://discordapp.com/nitro')
			.setThumbnail('https://i.imgur.com/DKaY8fV.jpg')
			.setColor(0x8395D3)
			.setTimestamp()
			.setDescription(stripIndents`
				This message can only be viewed by users with Discord Nitro.
				[More Information](https://discordapp.com/nitro)
			`);
		return msg.embed(embed);
	}
};
