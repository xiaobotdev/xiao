const { Command } = require('discord.js-commando');

module.exports = class ClearChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear-channel',
			aliases: ['prune-all'],
			group: 'moderation',
			memberName: 'clear-channel',
			description: 'Deletes all messages in a channel by cloning it and then deleting it.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			},
			clientPermissions: ['ADMINISTRATOR'],
			userPermissions: ['ADMINISTRATOR']
		});
	}

	async run(msg) {
		if (!msg.channel.deletable) return msg.reply('This channel cannot be deleted.');
		const channel = await msg.channel.clone();
		if (msg.channel.parent) await channel.setParent(msg.channel.parent);
		await msg.channel.delete();
		return null;
	}
};
