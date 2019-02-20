const Command = require('../../structures/Command');

module.exports = class SpoilerLetterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'spoiler-letter',
			aliases: ['spoiler'],
			group: 'text-edit',
			memberName: 'spoiler-letter',
			description: 'Sends text with each and every character as an individual spoiler.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert?',
					type: 'string',
					validate: text => {
						if (`||${text.split('').join('||||')}||`.length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(`||${text.split('').join('||||')}||`);
	}
};
