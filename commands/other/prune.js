const Command = require('../../structures/Command');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prune',
			aliases: ['clear'],
			group: 'other',
			memberName: 'prune',
			description: 'Deletes up to 99 messages from the current channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'count',
					label: 'amount of messages',
					prompt: 'How many messages do you want to delete? Limit of up to 99.',
					type: 'integer',
					min: 1,
					max: 99
				}
			]
		});
	}

	async run(msg, { count }) {
		try {
			const messages = await msg.channel.messages.fetch({ limit: count + 1 });
			await msg.channel.bulkDelete(messages, true);
			return null;
		} catch {
			return msg.reply('There are no messages younger than two weeks that can be deleted.');
		}
	}
};
