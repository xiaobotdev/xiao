const Command = require('../../framework/Command');

module.exports = class TheGameCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'the-game',
			group: 'games-sp',
			description: 'If you think about the game, you lose.'
		});
	}

	run(msg) {
		return msg.reply('You just lost the game!');
	}
};
