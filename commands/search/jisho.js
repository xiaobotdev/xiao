const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');

module.exports = class JishoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jisho',
			aliases: ['japanese-dictionary', 'define-japanese', 'define-jpn', 'jpn-define', 'japanese-define'],
			group: 'search',
			memberName: 'jisho',
			description: 'Defines a word, but with Japanese.',
			args: [
				{
					key: 'query',
					prompt: 'What word would you like to look up?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('http://jisho.org/api/v1/search/words')
				.query({ keyword: query });
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[0];
			return msg.say(stripIndents`
				**${data.japanese[0].word}**
				${data.senses[0].english_definitions.join(', ')}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
