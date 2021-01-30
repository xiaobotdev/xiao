const { ArgumentType } = require('discord.js-commando');

module.exports = class ImageOrAvatarArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'image-or-avatar');
	}

	async validate(value, msg, arg, currentMsg) {
		const image = await this.client.registry.types.get('image').validate(value, msg, arg, currentMsg);
		if (image) return image;
		return this.client.registry.types.get('user').validate(value, msg, arg, currentMsg);
	}

	async parse(value, msg, arg, currentMsg) {
		const image = this.client.registry.types.get('image').parse(value, msg, arg, currentMsg);
		if (image) return image;
		const user = await this.client.registry.types.get('user').parse(value, msg, arg, currentMsg);
		return user.displayAvatarURL({ format: 'png', size: 512 });
	}

	isEmpty(value, msg, arg, currentMsg) {
		return this.client.registry.types.get('image').isEmpty(value, msg, arg, currentMsg)
			&& this.client.registry.types.get('user').isEmpty(value, msg, arg, currentMsg);
	}
};
