const Command = require('../Command');

module.exports = class AutoReplyCommand extends Command {
	constructor(client, info) {
		super(client, info);

		this.reply = info.reply || false;
		this.throttling = null;
	}

	run(msg) {
		if (msg.guild && !msg.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return null;
		const text = this.generateText();
		if (!text) return null;
		return this.reply ? msg.reply(text) : msg.say(text);
	}

	generateText() {
		throw new Error('The generateText method is required.');
	}
};
