const Command = require('../../structures/Command');

module.exports = class LMGTFYCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lmgtfy',
			aliases: ['let-me-google-that-for-you', 'google'],
			group: 'random',
			memberName: 'lmgtfy',
			description: 'Creates a LMGTFY link with the query you provide.',
			args: [
				{
					key: 'query',
					prompt: 'What would you like the link to search for?',
					type: 'string',
					parse: query => encodeURIComponent(query)
				}
			]
		});
	}

	run(msg, { query }) {
		return msg.say(`http://lmgtfy.com/?iie=1&q=${query}`);
	}
};
