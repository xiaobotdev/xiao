const Command = require('../../structures/Command');

module.exports = class LotteryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lottery',
			group: 'games',
			memberName: 'lottery',
			description: 'Attempt to win the lottery, with a 1 in 100 chance of winning.'
		});
	}

	run(msg) {
		const lottery = Math.floor(Math.random() * 100) + 1;
		if (lottery === 1) return msg.say('Nice job! 10/10! You deserve some cake!');
		return msg.say('Nope, sorry, you lost.');
	}
};
