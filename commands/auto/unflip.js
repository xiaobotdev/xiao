const Command = require('../../structures/commands/AutoReply');

module.exports = class UnflipCommand extends Command {
	constructor(client, info) {
		super(client, {
			name: 'unflip',
			group: 'auto',
			memberName: 'unflip',
			description: 'Unflips a table.',
			patterns: [/\(╯°□°）╯︵ ┻━┻/i]
		});
	}

	generateText() {
		return '┬─┬ノ( º _ ºノ)';
	}
};
