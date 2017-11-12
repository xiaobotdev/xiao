const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class XKCDCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xkcd',
			aliases: ['kcd'],
			group: 'search',
			memberName: 'xkcd',
			description: 'Responds with an XKCD comic, either today\'s, a random one, or a specific one.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'Please enter either a specific comic number, today, or random.',
					type: 'string',
					default: 'today',
					parse: query => query.toLowerCase()
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const current = await snekfetch.get('https://xkcd.com/info.0.json');
			if (query === 'today') {
				const embed = new MessageEmbed()
					.setTitle(`${current.body.num} - ${current.body.title}`)
					.setColor(0x9797FF)
					.setURL(`https://xkcd.com/${current.body.num}`)
					.setImage(current.body.img)
					.setFooter(current.body.alt);
				return msg.embed(embed);
			}
			if (query === 'random') {
				const random = Math.floor(Math.random() * current.body.num) + 1;
				const { body } = await snekfetch.get(`https://xkcd.com/${random}/info.0.json`);
				const embed = new MessageEmbed()
					.setTitle(`${body.num} - ${body.title}`)
					.setColor(0x9797FF)
					.setURL(`https://xkcd.com/${body.num}`)
					.setImage(body.img)
					.setFooter(body.alt);
				return msg.embed(embed);
			}
			const choice = parseInt(query, 10);
			if (isNaN(choice) || current.body.num < choice || choice < 1) return msg.say('Could not find any results.');
			const { body } = await snekfetch.get(`https://xkcd.com/${choice}/info.0.json`);
			const embed = new MessageEmbed()
				.setTitle(`${body.num} - ${body.title}`)
				.setColor(0x9797FF)
				.setURL(`https://xkcd.com/${body.num}`)
				.setImage(body.img)
				.setFooter(body.alt);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
