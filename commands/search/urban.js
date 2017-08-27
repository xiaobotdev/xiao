const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../structures/Util');

module.exports = class UrbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'urban',
			group: 'search',
			memberName: 'urban',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get('http://api.urbandictionary.com/v0/define')
				.query({ term: query });
			if (!body.list.length) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x32A8F0)
				.setAuthor('Urban Dictionary', 'https://i.imgur.com/fzFuuL7.png')
				.setURL(body.list[0].permalink)
				.setTitle(body.list[0].word)
				.setDescription(shorten(body.list[0].definition))
				.addField('❯ Example',
					shorten(body.list[0].example, 1000) || 'None');
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
