const Command = require('../../framework/Command');

module.exports = class GiveFlowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give-flower',
			group: 'single',
			description: 'Gives Xiao Pai a flower.',
			credit: [
				{
					name: 'Marvelous',
					url: 'http://www.marv.jp/',
					reasonURL: 'http://www.runefactory4.com/index1.html',
					reason: 'Original "Rune Factory 4" Game'
				}
			]
		});
	}

	run(msg) {
		return msg.say('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
	}
};
