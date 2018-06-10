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
					default: '',
					min: 1,
					max: rules.length
				}
			]
		});
	}

	run(msg, { rule }) {
		if (!rule) return msg.say({ files: ['https://i.imgur.com/vGw29EQ.jpg'] });
		return msg.say(`**Rule #${rule}**: ${rules[rule - 1]}`);
	}
};
