const Command = require('../../framework/Command');

module.exports = class BinaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'binary',
			group: 'edit-text',
			description: 'Converts text to binary.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (this.binary(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(this.binary(text));
	}

	binary(text) {
		return text.split('').map(str => {
			const converted = str.charCodeAt(0).toString(2);
			return converted.padStart(8, '0');
		}).join(' ');
	}
};
