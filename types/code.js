const Argument = require('../framework/ArgumentType');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

module.exports = class CodeArgument extends Argument {
	constructor(client) {
		super(client, 'code');
	}

	validate(value) {
		if (!value) return false;
		return true;
	}

	async parse(value, msg) {
		if (!value) return null;
		if (/^[0-9]+$/.test(value)) {
			try {
				const message = await msg.channel.messages.fetch(value);
				value = message.content;
			} catch (err) {
				return { code: value, lang: null };
			}
		}
		if (codeblock.test(value)) {
			const parsed = codeblock.exec(value);
			return {
				code: parsed[2],
				lang: parsed[1] ? parsed[1].toLowerCase() : null
			};
		}
		return { code: value, lang: null };
	}
};
