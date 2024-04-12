const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = class FirstMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'first-message',
			aliases: ['first-msg'],
			group: 'info',
			memberName: 'first-message',
			description: 'Responds with the first message ever sent to a channel.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			args: [
				{
					key: 'channel',
					type: 'channel',
					default: msg => msg.channel
				}
			]
		});
	}

	async run(msg, { channel }) {
		if (msg.guild && !channel.permissionsFor(this.client.user).has(PermissionFlagsBits.ReadMessageHistory)) {
			return msg.reply(`Sorry, I don't have permission to read ${channel}...`);
		}
		const messages = await channel.messages.fetch({ after: 1, limit: 1 });
		const message = messages.first();
		const embed = new EmbedBuilder()
			.setColor(message.member ? message.member.displayHexColor : 0x00AE86)
			.setThumbnail(message.author.displayAvatarURL({ extension: 'png' }))
			.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ extension: 'png' }) })
			.setDescription(message.content)
			.setTimestamp(message.createdAt)
			.setFooter({ text: `ID: ${message.id}` })
			.addField('❯ Jump', `[Click Here to Jump](${message.url})`);
		return msg.embed(embed);
	}
};
