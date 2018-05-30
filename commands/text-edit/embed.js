const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'embed',
			group: 'text-edit',
			memberName: 'embed',
			description: 'Sends text in an embed.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to embed?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		const embed = new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setColor(0x00AE86)
			.setTimestamp()
			.setDescription(text);
		return msg.embed(embed);
	}
};
