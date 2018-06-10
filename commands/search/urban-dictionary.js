const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');
const types = ['random', 'top'];

module.exports = class UrbanDictionaryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban-dictionary',
			aliases: ['urban', 'define-urban'],
			group: 'search',
			memberName: 'urban-dictionary',
			description: 'Defines a word, but with Urban Dictionary.',
			details: `**Types**: ${types.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'word',
					prompt: 'What word would you like to look up?',
					type: 'string'
				},
				{
					key: 'type',
					prompt: 'Do you want to get the top answer or a random one?',
					type: 'string',
					default: 'top',
					oneOf: types,
					parse: type => type.toLowerCase()
				}
			]
		});
	}

	async run(msg, { word, type }) {
		try {
			const { body } = await request
				.get('http://api.urbandictionary.com/v0/define')
				.query({ term: word });
			if (!body.list.length) return msg.say('Could not find any results.');
			const data = body.list[type === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
			const embed = new MessageEmbed()
				.setColor(0x32A8F0)
				.setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
				.setURL(data.permalink)
				.setTitle(data.word)
				.setDescription(shorten(data.definition))
				.addField('❯ Example', data.example ? shorten(data.example, 1000) : 'None');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
