const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class EmojiInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji-info',
			aliases: ['emoji'],
			group: 'info',
			memberName: 'emoji',
			description: 'Responds with detailed information on an emoji.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'emoji',
					prompt: 'Which emoji would you like to get information on?',
					type: 'emoji'
				}
			]
		});
	}

	run(msg, { emoji }) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(emoji.url)
			.addField('❯ Name', emoji.name, true)
			.addField('❯ ID', emoji.id, true)
			.addField('❯ Creation Date', emoji.createdAt.toDateString(), true)
			.addField('❯ Animated?', emoji.animated ? 'Yes' : 'No', true);
		return msg.embed(embed);
	}
};
