const { Command } = require('discord.js-commando');

module.exports = class FixPortalChannelsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fix-portal-channels',
			group: 'portal',
			memberName: 'fix-portal-channels',
			description: 'Removes no longer existent channels from the portal list.',
			ownerOnly: true
		});
	}

	run(msg) {
		const channels = this.client.provider.get('global', 'portals', []);
		let count = 0;
		for (const channel of channels) {
			if (this.client.channels.has(channel)) continue;
			channels.splice(channels.indexOf(channel), 1);
			count++;
		}
		return msg.say(`Cleared **${count}** channels from the portal list.`);
	}
};
