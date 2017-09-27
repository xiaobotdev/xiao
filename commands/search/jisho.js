const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class JishoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jisho',
			aliases: ['japanese-dictionary', 'define-japanese', 'define-jpn', 'jpn-define', 'japanese-define'],
			group: 'search',
			memberName: 'jisho',
			description: 'Defines a word, but with Japanese.',
			clientPermissions: ['EMBED_LINKS'],
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
			const embed = new MessageEmbed()
				.setAuthor('Jisho', 'https://i.imgur.com/CBJZe2m.png')
				.setColor(0x0BC510)
				.setTitle(data.japanese[0].word)
				.setURL(`http://jisho.org/word/${data.japanese[0].word}`)
				.setDescription(data.senses[0].english_definitions.join(', '));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
