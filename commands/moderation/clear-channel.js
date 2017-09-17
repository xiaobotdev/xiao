const Command = require('../../structures/Command');

module.exports = class ClearChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear-channel',
			group: 'moderation',
			memberName: 'clear-channel',
			description: 'Deletes all messages in a channel by cloning it and then deleting it.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['MANAGE_CHANNELS'],
			userPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES']
		});
	}

	async run(msg) {
		if (!msg.channel.deletable) return msg.say('This channel cannot be deleted.');
		await msg.channel.clone();
		await msg.channel.delete();
		return null;
	}
};
