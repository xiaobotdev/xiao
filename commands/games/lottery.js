const { Command } = require('discord.js-commando');

module.exports = class LotteryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lottery',
			group: 'games',
			memberName: 'lottery',
			description: 'Attempt to win the lottery, with a 1 in 1000 chance of winning.'
		});
	}

	run(msg) {
		const loss = Math.floor(Math.random() * 1000);
		if (!loss) return msg.reply('Nice job! 10/10! You deserve some cake!');
		return msg.reply('Nope, sorry, you lost.');
	}
};
