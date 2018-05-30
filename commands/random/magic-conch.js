const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/magic-conch');

module.exports = class MagicConchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magic-conch',
			aliases: ['magic-conch-shell'],
			group: 'random',
			memberName: 'magic-conch',
			description: 'Asks your question to the Magic Conch.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the magic conch?',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		return msg.say(stripIndents`
			${question}
			🐚 ${answers[Math.floor(Math.random() * answers.length)]} 🐚
		`);
	}
};
