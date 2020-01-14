const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class JishoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jisho',
			aliases: ['japanese-dictionary', 'define-japanese', 'define-jpn'],
			group: 'search',
			memberName: 'jisho',
			description: 'Defines a word, but with Japanese.',
			credit: [
				{
					name: 'Jisho',
					url: 'https://jisho.org/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { word }) {
		try {
			const { body } = await request
				.get('http://jisho.org/api/v1/search/words')
				.query({ keyword: word });
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[0];
			return msg.say(stripIndents`
				**${data.japanese[0].word || data.japanese[0].reading}**
				${data.senses[0].english_definitions.join(', ')}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
