const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class EmbedCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'embed',
			group: 'edit-text',
			memberName: 'embed',
			description: 'Sends text in an embed.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.embed(new MessageEmbed().setDescription(text));
	}
};
