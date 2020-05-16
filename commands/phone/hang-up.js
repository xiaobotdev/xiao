const Command = require('../../structures/Command');

module.exports = class HangUpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hang-up',
			group: 'phone',
			memberName: 'hang-up',
			description: 'Hangs up the current phone call.',
			guildOnly: true
		});
	}

	async run(msg) {
		const origin = client.phone.find(call => call.origin.id === msg.channel.id);
		const recipient = client.phone.find(call => call.recipient.id === msg.channel.id);
		if (!origin && !recipient) return msg.reply('☎️ This channel is not in a phone call.');
		const call = origin || recipient;
		if (!call.active) return msg.reply('☎️ This call is not currently active.');
		if (call.ownerOrigin && !this.client.isOwner(msg.author)) {
			return msg.reply('☎️ You cannot hang up in an admin call.');
		}
		const nonQuitter = msg.channel.id === call.origin.id ? call.recipient : call.origin;
		await call.hangup(nonQuitter);
		return null;
	}
};
