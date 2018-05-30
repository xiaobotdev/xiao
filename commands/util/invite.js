const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['join'],
			group: 'util',
			memberName: 'invite',
			description: 'Responds with Xiao\'s invite links.',
			guarded: true
		});
	}

	async run(msg) {
		const invite = await this.client.generateInvite(372632641);
		return msg.say(stripIndents`
			To invite me to your server, use this link:
			<${invite}>

			Or, join my home server:
			${this.client.options.invite || 'Coming soon...'}
		`);
	}
};
