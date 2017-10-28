const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class DictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dictionary',
			aliases: ['define', 'wordnik', 'define-wordnik', 'wordnik-define'],
			group: 'search',
			memberName: 'dictionary',
			description: 'Defines a word.',
			args: [
				{
					key: 'query',
					prompt: 'What word would you like to look up?',
					type: 'string',
					parse: query => encodeURIComponent(query)
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get(`http://api.wordnik.com/v4/word.json/${query}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					api_key: WORDNIK_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			return msg.say(stripIndents`
				**${data.word}**
				(${data.partOfSpeech || '???'}) ${data.text}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
