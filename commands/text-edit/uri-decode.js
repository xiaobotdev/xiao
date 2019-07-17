const Command = require('../../structures/Command');

module.exports = class URLDecodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'url-decode',
			aliases: ['decode-url', 'decode-uri', 'uri-decode', 'decode-uri-component'],
			group: 'text-edit',
			memberName: 'url-decode',
			description: 'Decodes URL characters to regular characters.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to decode?',
					type: 'string',
					validate: text => {
						if (decodeURIComponent(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(decodeURIComponent(text));
	}
};
