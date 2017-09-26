const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { WORDNIK_KEY } = process.env;

module.exports = class ThesaurusCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'thesaurus',
			aliases: ['synonym', 'antonym', 'thesaurus-wordnik', 'wordnik-thesaurus'],
			group: 'search',
			memberName: 'thesaurus',
			description: 'Gets the synonyms and antonyms of a word.',
			clientPermissions: ['EMBED_LINKS'],
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
					relationshipTypes: ['synonym', 'antonym'],
					limitPerRelationshipType: 5,
					api_key: WORDNIK_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const synonyms = body.find(i => i.relationshipType === 'synonym');
			const antonyms = body.find(i => i.relationshipType === 'antonym');
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setTitle(query)
				.addField('> Synonyms',
					synonyms.words ? synonyms.words.join(', ') : 'N/A')
				.addField('> Antonyms',
					antonyms.words ? antonyms.words.join(', ') : 'N/A');
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
