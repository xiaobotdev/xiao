const Command = require('../../structures/Command');
const rules = require('../../assets/json/rule-of-the-internet');

module.exports = class RuleOfTheInternetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rule-of-the-internet',
			aliases: ['rules-of-the-internet', 'internet-rule', 'rule', 'rules'],
			group: 'search',
			memberName: 'rule-of-the-internet',
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
