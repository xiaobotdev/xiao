const Command = require('../../structures/Command');

module.exports = class GiveFlowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give-flower',
			group: 'single',
			memberName: 'give-flower',
			description: 'Gives Xiao Pai a flower.',
			credit: [
				{
					name: 'Rune Factory 4',
					url: 'http://www.runefactory4.com/index1.html'
				}
			]
		});
	}

	run(msg) {
		return msg.say('Ooh, what a pretty flower. What, I may have it? Thanks! I like flowers, yes? ♪');
	}
};
