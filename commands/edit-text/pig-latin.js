const Command = require('../../framework/Command');

module.exports = class PigLatinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pig-latin',
			group: 'edit-text',
			memberName: 'pig-latin',
			description: 'Converts text to pig latin.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (this.pigLatin(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(this.pigLatin(text));
	}

	pigLatin(text) {
		return text.replace(/\w+/g, this.pigLatinWord).toLowerCase();
	}

	pigLatinWord(word) {
		return `${word.slice(1)}${word.charAt(0)}ay`;
	}
};
