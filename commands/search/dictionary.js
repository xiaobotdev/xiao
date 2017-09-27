const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { WORDNIK_KEY } = process.env;

module.exports = class DictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dictionary',
			aliases: ['define', 'wordnik', 'define-wordnik'],
			group: 'search',
			memberName: 'dictionary',
			description: 'Defines a word.',
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
				.get(`http://api.wordnik.com/v4/word.json/${query}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					api_key: WORDNIK_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setAuthor('Wordnik', 'https://i.imgur.com/VcLZLXn.jpg')
				.setColor(0xFE6F11)
				.setTitle(data.word)
				.setURL(`http://wordnik.com/words/${query}#define`)
				.setDescription(`(${data.partOfSpeech || 'N/A'}) ${data.text}`);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
