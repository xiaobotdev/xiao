const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');
const logos = require('../../assets/json/logos');

module.exports = class UrbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			aliases: ['urban-dictionary', 'ud'],
			group: 'search',
			memberName: 'urban',
			description: 'Defines a word, but with Urban Dictionary.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Urban Dictionary',
					url: 'https://www.urbandictionary.com/',
					reason: 'API',
					reasonURL: 'https://github.com/zdict/zdict/wiki/Urban-dictionary-API-documentation'
				}
			],
			args: [
				{
					key: 'word',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { word }) {
		const { body } = await request
			.get('http://api.urbandictionary.com/v0/define')
			.query({ term: word });
		if (!body.list.length) return msg.say('Could not find any results.');
		const data = body.list[0];
		const embed = new MessageEmbed()
			.setColor(0x32A8F0)
			.setAuthor('Urban Dictionary', logos.urban, 'https://www.urbandictionary.com/')
			.setURL(data.permalink)
			.setTitle(data.word)
			.setDescription(shorten(data.definition.replace(/\[|\]/g, '')))
			.setFooter(`👍 ${formatNumber(data.thumbs_up)} 👎 ${formatNumber(data.thumbs_down)}`)
			.setTimestamp(new Date(data.written_on))
			.addField('❯ Example', data.example ? shorten(data.example.replace(/\[|\]/g, ''), 1000) : 'None');
		return msg.embed(embed);
	}
};
