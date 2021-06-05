const Command = require('../../framework/Command');

module.exports = class LMGTFYCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lmgtfy',
			aliases: ['let-me-google-that-for-you'],
			group: 'edit-text',
			memberName: 'lmgtfy',
			description: 'Creates a LMGTFY link with the query you provide.',
			credit: [
				{
					name: 'LMGTFY',
					url: 'https://lmgtfy.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What would you like the link to search for?',
					type: 'string',
					validate: query => {
						if (encodeURIComponent(query).length < 1950) return true;
						return 'Invalid query, your query is too long.';
					},
					parse: query => encodeURIComponent(query)
				}
			]
		});
	}

	run(msg, { query }) {
		return msg.say(`http://lmgtfy.com/?iie=1&q=${query}`);
	}
};
