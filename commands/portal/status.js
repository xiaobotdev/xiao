const Command = require('../../structures/Command');

module.exports = class PortalStatusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'portal-status',
			group: 'portal',
			memberName: 'status',
			description: 'Shows the number of currently opened portals.'
		});
	}

	run(msg) {
		const channels = this.client.provider.get('global', 'portals', []);
		const local = msg.channel.type === 'text' ? channels.filter(c => msg.guild.channels.has(c)).length : 0;
		return msg.say(
			`There are currently **${channels.length}** open portals${msg.channel.type === 'text'
				? `, **${local}** of which are in this server.`
				: '.'}`
		);
	}
};
