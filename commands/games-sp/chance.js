const Command = require('../../structures/Command');

module.exports = class ChanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chance',
			aliases: ['1-in', 'one-in'],
			group: 'games-sp',
			memberName: 'chance',
			description: 'Attempt to win with a 1 in 1000 (or your choice) chance of winning.',
			args: [
				{
					key: 'chance',
					prompt: 'What is the chance of winning? 1 in what?',
					type: 'string',
					default: 1000
				}
			]
		});
	}

	run(msg, { chance }) {
		const loss = Math.floor(Math.random() * chance);
		if (!loss) return msg.reply('Nice job! 10/10! You deserve some cake!');
		return msg.reply('Nope, sorry, you lost.');
	}
};
