const Command = require('../../framework/Command');
const { stripIndents } = require('common-tags');
const opinions = ['👍', '👎'];

module.exports = class OpinionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'opinion',
			group: 'random-res',
			description: 'Determines the opinion on something.',
			args: [
				{
					key: 'question',
					type: 'string',
					max: 1950
				}
			]
		});
	}

	run(msg, { question }) {
		return msg.say(stripIndents`
			_${question}_
			${opinions[Math.floor(Math.random() * opinions.length)]}
		`);
	}
};
