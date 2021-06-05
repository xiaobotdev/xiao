const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class FirstMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'first-message',
			aliases: ['first-msg'],
			group: 'info',
			memberName: 'first-message',
			description: 'Responds with the first message ever sent to a channel.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'channel',
					prompt: 'Which channel would you like to get the first message of?',
					type: 'channel',
					default: msg => msg.channel
				}
			]
		});
	}

	async run(msg, { channel }) {
		if (msg.guild && !channel.permissionsFor(this.client.user).has('READ_MESSAGE_HISTORY')) {
			return msg.reply(`Sorry, I don't have permission to read ${channel}...`);
		}
		const messages = await channel.messages.fetch({ after: 1, limit: 1 });
		const message = messages.first();
		const embed = new MessageEmbed()
			.setColor(message.member ? message.member.displayHexColor : 0x00AE86)
			.setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(message.content)
			.setTimestamp(message.createdAt)
			.setFooter(`ID: ${message.id}`)
			.addField('❯ Jump', `[Click Here to Jump](${message.url})`);
		return msg.embed(embed);
	}
};
