const Command = require('../../structures/Command');

module.exports = class RemovePortalChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove-portal-channel',
			aliases: ['delete-portal-channel', 'close-portal'],
			group: 'portal',
			memberName: 'remove-channel',
			description: 'Remove a channel from the portal channels.',
			guildOnly: true,
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					key: 'channel',
					prompt: 'What channel do you want to remove from the portal channels?',
					type: 'channel',
					default: msg => msg.channel
				}
			]
		});
	}

	run(msg, { channel }) {
		if (channel.type !== 'text') return msg.reply('Only text channels can have a portal!');
		const channels = this.client.provider.get('global', 'portals', []);
		if (!channels.includes(channel.id)) return msg.reply(`${channel} does not have an open portal!`);
		channels.splice(channels.indexOf(channel.id), 1);
		if (!channels.length) this.client.provider.remove('global', 'portals');
		else this.client.provider.set('global', 'portals', channels);
		return msg.say(`The portal in ${channel} closed...`);
	}
};
