const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class MessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'message',
			aliases: ['message-info', 'msg', 'msg-info', 'reply'],
			group: 'info',
			memberName: 'message',
			description: 'Responds with detailed information on a message.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'message',
					prompt: 'Which message would you like to get information on?',
					type: 'message'
				}
			]
		});
	}

	run(msg, { message }) {
		const hasImage = message.attachments.size && message.attachments.first().width;
		const embed = new MessageEmbed()
			.setColor(message.member ? message.member.displayHexColor : 0x00AE86)
			.setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setImage(hasImage ? message.attachments.first().url : null)
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(message.content)
			.setTimestamp(message.createdAt)
			.setFooter(`ID: ${message.id}`)
			.addField('❯ Jump', `[Click Here to Jump](${message.url})`);
		return msg.embed(embed);
	}
};
