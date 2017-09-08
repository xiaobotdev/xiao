const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = require('../../assets/json/8-ball');

module.exports = class MagicBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8-ball',
			group: 'random-res',
			memberName: '8-ball',
			description: 'Asks your question to the Magic 8 Ball.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask the 8 ball?',
					type: 'string'
				}
			]
		});
	}

	run(msg, args) {
		const { question } = args;
		return msg.say(stripIndents`
			Question: ${question}
			🎱 ${answers[Math.floor(Math.random() * answers.length)]} 🎱
		`);
	}
};
