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
		if (attachment.size > 8e+6) return false;
		return true;
	}

	parse(value, msg) {
		if (!msg.attachments.size) {
			return this.client.registry.types.get('user').parse(value, msg).displayAvatarURL({
				format: 'png',
				size: 512
			});
		}
		return msg.attachments.first().url;
	}
}

module.exports = ImageArgumentType;
