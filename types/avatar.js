const { ArgumentType } = require('discord.js-commando');

class AvatarArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'avatar');
	}

	validate(value, msg, arg) {
		return this.client.registry.types.get('user').validate(value, msg, arg);
	}

	async parse(value, msg, arg) {
		const user = await this.client.registry.types.get('user').parse(value, msg, arg);
		return user.displayAvatarURL({ format: 'png', size: 512 });
	}
}

module.exports = AvatarArgumentType;
