const Command = require('../../framework/Command');
const rules = require('../../assets/json/rule');

module.exports = class RuleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rule',
			aliases: ['rule-of-the-internet'],
			group: 'search',
			memberName: 'rule',
			description: 'Responds with a rule of the internet.',
			args: [
				{
					key: 'rule',
					prompt: 'Which rule would you like to view?',
					type: 'integer',
					min: 1,
					max: rules.length
				}
			]
		});
	}

	run(msg, { rule }) {
		return msg.say(`**Rule #${rule}:** ${rules[rule - 1]}`);
	}
};
