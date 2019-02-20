const Command = require('../../structures/Command');

module.exports = class UnspoilerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unspoiler',
			group: 'text-edit',
			memberName: 'unspoiler',
			description: 'Removes all spoilers from text.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to unspoiler?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text.replace(/\|\|.+\|\|/g, ''));
	}
};
