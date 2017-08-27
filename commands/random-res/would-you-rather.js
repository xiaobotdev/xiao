const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather'],
			group: 'random-res',
			memberName: 'would-you-rather',
			description: 'Responds with a random would you rather question.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('http://www.rrrather.com/botapi');
			const embed = new MessageEmbed()
				.setTitle(`${body.title}...`)
				.setURL(body.link)
				.setColor(0x9797FF)
				.setDescription(`${body.choicea} OR ${body.choiceb}?`);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
