const Argument = require('../framework/ArgumentType');

module.exports = class ImageOrAvatarArgument extends Argument {
	constructor(client) {
		super(client, 'image-or-avatar');
	}

	async validate(value, msg, arg) {
		const image = await this.client.registry.types.get('image').validate(value, msg, arg);
		if (image) return image;
		return this.client.registry.types.get('user').validate(value, msg, arg);
	}

	async parse(value, msg, arg) {
		const image = this.client.registry.types.get('image').parse(value, msg, arg);
		if (image) return image;
		const user = await this.client.registry.types.get('user').parse(value, msg, arg);
		return user.displayAvatarURL({ extension: 'png', size: arg.avatarSize });
	}

	isEmpty(value, msg, arg) {
		return this.client.registry.types.get('image').isEmpty(value, msg, arg)
			&& this.client.registry.types.get('user').isEmpty(value, msg, arg);
	}

	example(msg, arg) {
		return this.client.registry.types.get('user').example(msg, arg);
	}
};
