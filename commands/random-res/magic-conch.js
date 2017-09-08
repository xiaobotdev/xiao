const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = ['Maybe someday', 'Nothing', 'Neither', 'I don\'t think so', 'Yes', 'Try asking again'];

module.exports = class MagicConchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'magic-conch',
			group: 'random-res',
			memberName: 'magic-conch',
			description: 'Asks your question to the Magic Conch.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the magic conch?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { question } = args;
		return msg.say(stripIndents`
			Question: ${question}
			🐚 ${answers[Math.floor(Math.random() * answers.length)]} 🐚
		`);
	}
};
