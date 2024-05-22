const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prune',
			aliases: ['clear', 'bulk-delete'],
			group: 'other',
			description: 'Deletes up to 99 messages from the current channel.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},
			clientPermissions: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
			userPermissions: [PermissionFlagsBits.ManageMessages],
			args: [
				{
					key: 'count',
					label: 'amount of messages',
					type: 'integer',
					min: 1,
					max: 100
				}
			]
		});
	}

	async run(msg, { count }) {
		count++;
		try {
			const messages = await msg.channel.messages.fetch({ limit: count > 100 ? 100 : count });
			await msg.channel.bulkDelete(messages, true);
			return null;
		} catch {
			return msg.reply('There are no messages younger than two weeks that can be deleted.');
		}
	}
};
