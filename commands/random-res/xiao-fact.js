const Command = require('../../framework/Command');
const facts = require('../../assets/json/xiao-fact');

module.exports = class XiaoFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xiao-fact',
			aliases: ['iao-fact', 'bot-fact', 'easter-egg'],
			group: 'random-res',
			memberName: 'xiao-fact',
			description: 'Responds with a random fact about Xiao.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
