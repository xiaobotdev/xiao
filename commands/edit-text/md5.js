const Command = require('../../framework/Command');
const { hash } = require('../../util/Util');

module.exports = class MD5Command extends Command {
	constructor(client) {
		super(client, {
			name: 'md5',
			group: 'edit-text',
			memberName: 'md5',
			description: 'Creates a hash of text with the MD5 algorithm.',
			args: [
				{
					key: 'text',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(hash(text, 'md5'));
	}
};
