const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class ThesaurusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thesaurus',
			aliases: ['synonym', 'antonym', 'thesaurus-wordnik', 'wordnik-thesaurus'],
			group: 'search',
			memberName: 'thesaurus',
			description: 'Gets the synonyms and antonyms of a word.',
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
				.get(`http://api.wordnik.com/v4/word.json/${query}/relatedWords`)
				.query({
					relationshipTypes: 'synonym,antonym',
					limitPerRelationshipType: 5,
					api_key: WORDNIK_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const synonyms = body.find(words => words.relationshipType === 'synonym');
			const antonyms = body.find(words => words.relationshipType === 'antonym');
			return msg.say(stripIndents`
				**${query}**
				__Synonyms:__ ${synonyms ? synonyms.words.join(', ') : 'N/A'}
				__Antonyms:__ ${antonyms ? antonyms.words.join(', ') : 'N/A'}
			`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
