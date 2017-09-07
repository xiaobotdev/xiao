const Command = require('../../structures/Command');

module.exports = class BCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'b',
			aliases: ['🅱'],
			group: 'text-edit',
			memberName: 'b',
			description: ':b:.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to :b:?',
					type: 'string',
					validate: text => {
						if (text.replace(/(b|d|g|p|q)/gi, ':b:').length < 2000) return true;
						return 'Your text is too long.';
					}
				}
			]
		});
	}

	run(msg, args) {
		const { text } = args;
		return msg.say(text.replace(/(b|d|g|p|q)/gi, ':b:'));
	}
};
