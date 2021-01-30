const { ArgumentType } = require('discord.js-commando');

module.exports = class ImageOrAvatarArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'image-or-avatar');
	}

	validate(value, msg, arg) {
		return this.client.registry.types.get('image').validate(value, msg, arg)
			|| this.client.registry.types.get('user').validate(value, msg, arg);
	}

	async parse(value, msg, arg) {
		const image = this.client.registry.types.get('image').parse(value, msg, arg);
		if (image) return image;
		const user = await this.client.registry.types.get('user').parse(value, msg, arg);
		return user.displayAvatarURL({ format: 'png', size: 512 });
	}

	isEmpty(value, msg, arg) {
		return this.client.registry.types.get('image').isEmpty(value, msg, arg)
			|| this.client.registry.types.get('user').isEmpty(value, msg, arg);
	}
};
