const { Command } = require('discord.js-commando');
const { stripIndent } = require('common-tags');
const answers = ['no1', 'yes1', 'no2', 'yes2'];

module.exports = class CharlieCharlieChallengeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'charlie-charlie-challenge',
			aliases: ['charlie-charlie'],
			group: 'random-res',
			memberName: 'charlie-charlie-challenge',
			description: 'Asks your question to Charlie.',
			args: [
				{
					key: 'question',
					prompt: 'What do you want to ask Charlie?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { question }) {
		const answer = answers[Math.floor(Math.random() * answers.length)];
		return msg.say(stripIndent`
			${question}
			\`\`\`
			    ${answer === 'no1' ? '\\' : ' '}  |  ${answer === 'yes1' ? '/' : ' '}
			  NO ${answer === 'no1' ? '\\' : ' '} | ${answer === 'yes1' ? '/' : ' '}YES
			      ${answer === 'no1' ? '\\' : ' '}|${answer === 'yes1' ? '/' : ' '}
			———————+————————
			      ${answer === 'yes2' ? '/' : ' '}|${answer === 'no2' ? '\\' : ' '}
			  YES${answer === 'yes2' ? '/' : ' '} | ${answer === 'no2' ? '\\' : ' '}NO
			    ${answer === 'yes2' ? '/' : ' '}  |  ${answer === 'no2' ? '\\' : ' '}
			\`\`\`
		`);
	}
};
