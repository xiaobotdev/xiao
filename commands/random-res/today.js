const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class TodayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'today',
			aliases: ['event', 'history'],
			group: 'random-res',
			memberName: 'today',
			description: 'Responds with an event that occurred today in history, or on a specific day.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'date',
					prompt: 'What date do you want events for? Month/Day format.',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const { date } = args;
		try {
			const { text } = await snekfetch
				.get(`http://history.muffinlabs.com/date${date ? `/${date}` : ''}`);
			const body = JSON.parse(text);
			const events = body.data.Events;
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setURL(body.url)
				.setTitle(`On this day (${body.date})...`)
				.setTimestamp()
				.setDescription(`${event.year}: ${event.text}`);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404 || err.status === 500) return msg.say('Invalid date.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
