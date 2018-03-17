const { ArgumentType } = require('discord.js-commando');

class ImageArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'image');
	}

	async validate(value, msg) {
		const attachment = msg.attachments.first();
		if (!attachment) {
			const valid = await this.client.registry.types.get('user').validate(value, msg);
			return valid;
		}
		if (!attachment.height || !attachment.width) return false;
		if (attachment.size > 8e+6) return 'Please provide an image under 8 MB.';
		return true;
	}

	parse(value, msg, arg) {
		if (!msg.attachments.size) {
			return this.client.registry.types.get('user').parse(value, msg).displayAvatarURL({
				format: 'png',
				size: 512
			});
		}
		return msg.attachments.first().url;
	}

	isEmpty(value, msg) {
		if (!msg.attachments.size) return !value;
		return !msg.attachments.size;
	}
}

module.exports = ImageArgumentType;
