const Command = require('../Command');

module.exports = class AutoReplyCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.reply = info.reply || false;
		this.throttling = null;
	}

	run(msg, args, fromPattern) {
		if (msg.guild && !msg.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return null;
		return this.reply ? msg.reply(this.generateText(fromPattern)) : msg.say(this.generateText(fromPattern));
	}

	generateText() {
		throw new Error('The generateText method is required.');
	}
};
