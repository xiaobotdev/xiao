const Command = require('../../framework/Command');
const { hash } = require('../../util/Util');

module.exports = class SHA256Command extends Command {
	constructor(client) {
		super(client, {
			name: 'sha-256',
			group: 'edit-text',
			description: 'Creates a hash of text with the SHA-256 algorithm.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(hash(text, 'sha256'));
	}
};
