const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class GoogleAutofillCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-autofill',
			aliases: ['google-autocomplete', 'autofill', 'autocomplete'],
			group: 'other',
			memberName: 'google-autofill',
			description: 'Gets a list of Google Autofill results for a particular query.',
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { text } = await snekfetch
				.get('https://suggestqueries.google.com/complete/search')
				.query({
					client: 'firefox',
					q: query
				});
			const data = JSON.parse(text)[1];
			if (!data.length) return msg.say('Could not find any results.');
			return msg.say(data.join('\n'));
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
