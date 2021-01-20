const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const answers = ['Yes', 'No'];

module.exports = class YesNoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yes-no',
			aliases: ['y-n'],
			group: 'random-res',
			memberName: 'yes-no',
			description: 'Answers a yes/no question randomly.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to get an answer for?',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		return msg.say(stripIndents`
			_${question}_
			${answers[Math.floor(Math.random() * answers.length)]}
		`);
	}
};
