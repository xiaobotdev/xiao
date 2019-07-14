const Command = require('../../structures/Command');

module.exports = class UnflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unflip',
			group: 'single',
			memberName: 'unflip',
			description: 'Unflips a flipped table.',
			patterns: [/\(╯°□°）╯︵ ┻━┻/i]
		});
	}

	run(msg) {
		return msg.say('┬─┬ ノ( ゜-゜ノ)');
	}
};
