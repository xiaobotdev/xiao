const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class TodayInHistoryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'today-in-history',
			aliases: ['event', 'today', 'history'],
			group: 'events',
			memberName: 'today-in-history',
			description: 'Responds with an event that occurred today in history.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		try {
			const { text } = await snekfetch.get('http://history.muffinlabs.com/date');
			const body = JSON.parse(text);
			const events = body.data.Events;
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setURL(body.url)
				.setTitle(`On this day (${body.date})...`)
				.setTimestamp()
				.setDescription(`${event.year}: ${event.text}`)
				.addField('❯ See More',
					event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join(', '));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
