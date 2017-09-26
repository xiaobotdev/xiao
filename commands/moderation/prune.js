const Command = require('../../structures/Command');

module.exports = class PruneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prune',
			group: 'moderation',
			memberName: 'prune',
			description: 'Deletes up to 99 messages from the current channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 15
			},
			clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'count',
					label: 'amount of messages',
					prompt: 'How many messages do you want to delete? Limit of up to 99.',
					type: 'integer',
					validate: count => {
						if (count < 100 && count > 0) return true;
						return 'Invalid count, please enter a number from 1-99.';
					}
				}
			]
		});
	}

	async run(msg, { count }) {
		const messages = await msg.channel.messages.fetch({ limit: count + 1 });
		const msgs = await msg.channel.bulkDelete(messages, true);
		if (!msgs.size) return msg.say('There are no messages younger than two weeks that can be deleted.');
		return null;
	}
};
