const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class QuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			group: 'random-res',
			memberName: 'quote',
			description: 'Responds with a random quote.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const { body } = await snekfetch
			.get('https://talaikis.com/api/quotes/random/');
		const embed = new MessageEmbed()
			.setColor(0x9797FF)
			.setAuthor(body.author)
			.setDescription(body.quote);
		return msg.embed(embed);
	}
};
