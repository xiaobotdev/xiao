const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');

module.exports = class UrbanDictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban-dictionary',
			aliases: ['urban', 'define-urban'],
			group: 'search',
			memberName: 'urban-dictionary',
			description: 'Searches Urban Dictionary for your query.',
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
				.get('http://api.urbandictionary.com/v0/define')
				.query({ term: query });
			if (!body.list.length) return msg.say('Could not find any results.');
			const data = body.list[Math.floor(Math.random() * body.list.length)];
			const embed = new MessageEmbed()
				.setColor(0x32A8F0)
				.setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png')
				.setURL(data.permalink)
				.setTitle(data.word)
				.setDescription(shorten(data.definition))
				.addField('❯ Example',
					data.example ? shorten(data.example, 1000) : 'None');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
