const Command = require('../../structures/Command');
const { list } = require('../../util/Util');
const modes = ['encode', 'decode'];

module.exports = class BinaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'binary',
			group: 'text-edit',
			memberName: 'binary',
			description: 'Converts text to/from binary.',
			details: `**Modes**: ${modes.join(', ')}`,
			args: [
				{
					key: 'mode',
					prompt: `Would you like to ${list(modes, 'or')}?`,
					type: 'string',
					oneOf: modes,
					parse: mode => mode.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What text would you like to convert to binary?',
					type: 'string',
					validate: text => {
						if (this.binary(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { mode, text }) { // eslint-disable-line consistent-return
		if (mode === 'encode') return msg.say(this.binary(text));
		else if (mode === 'decode') return msg.say(this.unbinary(text));
	}

	binary(text) {
		return text.split('').map(str => {
			const converted = str.charCodeAt(0).toString(2);
			return converted.padStart(8, '0');
		}).join(' ');
	}

	unbinary(text) {
		return text.split(' ').map(str => String.fromCharCode(Number.parseInt(str, 2))).join('');
	}
};
