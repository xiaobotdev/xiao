const Command = require('../../structures/Command');
const { hash } = require('../../util/Util');

module.exports = class SHA256Command extends Command {
	constructor(client) {
		super(client, {
			name: 'sha-256',
			group: 'text-edit',
			memberName: 'sha-256',
			description: 'Creates a hash of text with the SHA-256 algorithm.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to create an SHA-256 hash of?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(hash(text, 'sha256'));
	}
};
