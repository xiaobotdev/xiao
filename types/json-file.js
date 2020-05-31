const { ArgumentType } = require('discord.js-commando');
const fileTypeRe = /\.(json)$/i;
const request = require('node-superfetch');

module.exports = class JsonFileArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'json-file');
	}

	validate(value, msg) {
		const attachment = msg.attachments.first();
		if (!attachment) return false;
		if (!fileTypeRe.test(attachment.name)) return 'Please provide a JSON file.';
		return true;
	}

	async parse(value, msg) {
		const attachment = msg.attachments.first();
		const { body } = await request.get(attachment.url);
		return body;
	}

	isEmpty(value, msg, arg) {
		if (msg.attachments.size) return false;
		return this.client.registry.types.get('user').isEmpty(value, msg, arg);
	}
};
