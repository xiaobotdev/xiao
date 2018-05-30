const Command = require('../../structures/Command');

module.exports = class FixPortalChannelsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fix-portal-channels',
			aliases: ['fix-portals'],
			group: 'portal',
			memberName: 'fix-channels',
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
		if (!channels.length) this.client.provider.remove('global', 'portals');
		else this.client.provider.set('global', 'portals', channels);
		return msg.say(`Cleared **${count}** channels from the portal list.`);
	}
};
