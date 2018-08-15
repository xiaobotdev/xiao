const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class DictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dictionary',
			aliases: ['define', 'wordnik', 'define-wordnik', 'wordnik-define', 'wordnik-dictionary'],
			group: 'search',
			memberName: 'dictionary',
			description: 'Defines a word.',
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string',
					parse: word => encodeURIComponent(word)
				}
			]
		});
	}

	async run(msg, { word }) {
		try {
			const { body } = await request
				.get(`http://api.wordnik.com/v4/word.json/${word}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					useCanonical: true,
					api_key: WORDNIK_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			return msg.say(stripIndents`
				**${data.word}**
				(${data.partOfSpeech || 'unknown'}) ${data.text}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
