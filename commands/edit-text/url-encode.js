const Command = require('../../framework/Command');

module.exports = class URLEncodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'url-encode',
			aliases: ['encode-url', 'encode-uri', 'uri-encode', 'encode-uri-component'],
			group: 'edit-text',
			description: 'Encodes text to URL-friendly characters.',
			args: [
				{
					key: 'text',
					type: 'string',
					validate: text => {
						if (encodeURIComponent(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(encodeURIComponent(text));
	}
};
