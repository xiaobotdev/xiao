const Command = require('../../structures/Command');
const validURL = require('valid-url');

module.exports = class ValidUrlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'valid-url',
			aliases: ['url-valid', 'url-test', 'test-url'],
			group: 'analyze',
			memberName: 'valid-url',
			description: 'Tests whether a URL is valid or not.',
			args: [
				{
					key: 'url',
					prompt: 'What URL would you like to test?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { url }) {
		const valid = validURL.isWebUri(url);
		if (!valid) return msg.reply('👎 This is not a valid URL.');
		return msg.reply('👍 This is a valid URL.');
	}
};
