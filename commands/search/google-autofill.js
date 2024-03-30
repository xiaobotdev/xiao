const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class GoogleAutofillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-autofill',
			aliases: ['google-autocomplete', 'autofill', 'autocomplete'],
			group: 'search',
			memberName: 'google-autofill',
			description: 'Responds with a list of the Google Autofill results for a particular query.',
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Autofill API'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const { text } = await request
			.get('https://suggestqueries.google.com/complete/search')
			.query({
				client: 'firefox',
				q: query
			});
		const data = JSON.parse(text)[1];
		if (!data.length) return msg.say('Could not find any results.');
		return msg.say(data.join('\n'));
	}
};
