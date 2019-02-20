const Command = require('../../structures/Command');

module.exports = class UnspoilerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unspoiler',
			group: 'text-edit',
			memberName: 'unspoiler',
			description: 'Removes all spoilers from a message.',
			args: [
				{
					key: 'message',
					prompt: 'What message would you like to unspoiler?',
					type: 'message'
				}
			]
		});
	}

	run(msg, { message }) {
		return msg.say(message.content.replace(/\|\|([^|]+)\|\|/g, '$1'));
	}
};
