const Command = require('../../structures/Command');

module.exports = class AddPortalChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-portal-channel',
			aliases: ['set-portal-channel', 'portal-channel', 'open-portal'],
			group: 'portal',
			memberName: 'add-channel',
			description: 'Sets a channel to be a portal channel.',
			guildOnly: true,
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					key: 'channel',
					prompt: 'What channel do you want to set as a portal channel?',
					type: 'channel',
					default: msg => msg.channel
				}
			]
		});
	}

	run(msg, { channel }) {
		if (channel.type !== 'text') return msg.reply('Only text channels can have a portal!');
		const channels = this.client.provider.get('global', 'portals', []);
		if (channels.includes(channel.id)) return msg.reply(`${channel} already has an open portal!`);
		channels.push(channel.id);
		this.client.provider.set('global', 'portals', channels);
		return msg.say(`A portal opened in ${channel}!`);
	}
};
