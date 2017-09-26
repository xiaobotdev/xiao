const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class JapaneseDefineCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'japanese-define',
			aliases: ['japanese-dictionary', 'define-japanese', 'define-jpn', 'jpn-define', 'jisho'],
			group: 'search',
			memberName: 'japanese-dictionary',
			description: 'Defines a word, but with Japanese.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What would you like to define?',
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
				.setColor(0x9797FF)
				.setTitle(data.japanese[0].word)
				.setDescription(data.senses[0].english_definitions.join(', '));
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
