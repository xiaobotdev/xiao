const Command = require('../../structures/Command');
const { hash } = require('../../util/Util');

module.exports = class SHA1Command extends Command {
	constructor(client) {
		super(client, {
			name: 'sha-1',
			group: 'text-edit',
			memberName: 'sha-1',
			description: 'Creates a hash of text with the SHA-1 algorithm.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to create an SHA-1 hash of?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(hash(text, 'sha1'));
	}
};
