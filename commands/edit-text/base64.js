const Command = require('../../framework/Command');
const { base64 } = require('../../util/Util');
const modes = ['encode', 'decode'];

module.exports = class Base64Command extends Command {
	constructor(client) {
		super(client, {
			name: 'base64',
			group: 'edit-text',
			description: 'Converts text to/from Base64.',
			details: `**Modes:** ${modes.join(', ')}`,
			args: [
				{
					key: 'mode',
					type: 'string',
					oneOf: modes,
					parse: mode => mode.toLowerCase()
				},
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (base64(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { mode, text }) {
		const converted = base64(text, mode);
		if (!converted) return msg.reply('That is not valid Base64.');
		return msg.say(converted);
	}
};
