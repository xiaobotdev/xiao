const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { embedURL } = require('../../util/Util');

module.exports = class TodayInHistoryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'today-in-history',
			aliases: ['today', 'history'],
			group: 'events',
			description: 'Responds with an event that occurred today in history.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'muffinlabs - Today in History',
					url: 'http://history.muffinlabs.com/',
					reason: 'API',
					reasonURL: 'http://history.muffinlabs.com/#api'
				}
			],
			args: [
				{
					key: 'month',
					type: 'month',
					default: ''
				},
				{
					key: 'day',
					type: 'integer',
					default: '',
					min: 1,
					max: 31
				}
			]
		});
	}

	async run(msg, { month, day }) {
		const date = month && day ? `/${month}/${day}` : '';
		try {
			const { text } = await request.get(`http://history.muffinlabs.com/date${date}`);
			const body = JSON.parse(text);
			const events = body.data.Events;
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new EmbedBuilder()
				.setColor(0x9797FF)
				.setURL(body.url)
				.setTitle(`On this day (${body.date})...`)
				.setTimestamp()
				.setDescription(`${event.year}: ${event.text}`)
				.addField('❯ See More', event.links.map(link => embedURL(link.title, link.link)).join('\n'));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404 || err.status === 500) return msg.say('Invalid date.');
			throw err;
		}
	}
};
