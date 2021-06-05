const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class EmojiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji',
			aliases: ['emoji-info', 'emote'],
			group: 'info',
			memberName: 'emoji',
			description: 'Responds with detailed information on an emoji.',
			guildOnly: true,
			clientPermissions: ['EMBED_LINKS', 'MANAGE_EMOJIS'],
			args: [
				{
					key: 'emoji',
					prompt: 'Which emoji would you like to get information on?',
					type: 'custom-emoji'
				}
			]
		});
	}

	async run(msg, { emoji }) {
		if (!emoji.author && !emoji.managed) await emoji.fetchAuthor();
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setThumbnail(emoji.url)
			.addField('❯ Name', emoji.name, true)
			.addField('❯ ID', emoji.id, true)
			.addField('❯ Creation Date', moment.utc(emoji.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Animated?', emoji.animated ? 'Yes' : 'No', true)
			.addField('❯ External?', emoji.managed ? 'Yes' : 'No', true)
			.addField('❯ Added By', emoji.author ? emoji.author.tag : '???', true);
		return msg.embed(embed);
	}
};
