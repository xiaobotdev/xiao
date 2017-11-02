const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class MapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'map',
			aliases: ['google-maps', 'google-map'],
			group: 'search',
			memberName: 'map',
			description: 'Responds with a map based upon your query.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'zoom',
					label: 'zoom level',
					prompt: 'What would you like the zoom level to be? Must be a number from 1-20.',
					type: 'integer',
					min: 1,
					max: 20
				},
				{
					key: 'query',
					prompt: 'What location would you like to get a map of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { zoom, query }) {
		try {
			const { body } = await snekfetch
				.get('https://maps.googleapis.com/maps/api/staticmap')
				.query({
					center: query,
					zoom,
					size: '500x500',
					key: GOOGLE_KEY
				});
			const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
			return msg.say(`<${url}>`, { files: [{ attachment: body, name: 'map.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
