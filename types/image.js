const { ArgumentType } = require('discord.js-commando');

class ImageArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'image');
	}

	validate(value, msg) {
		const attachment = msg.attachments.first();
		if (!attachment || !attachment.height || !attachment.width) return false;
		if (attachment.size > 8e+6) return 'Please provide an image under 8 MB.';
		return true;
	}

	parse(value, msg) {
		return msg.attachments.first().url;
	}

	isEmpty(value, msg) {
		return msg.attachments.size === 0;
	}
}

module.exports = ImageArgumentType;
