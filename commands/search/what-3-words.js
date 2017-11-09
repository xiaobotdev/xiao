const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { W3W_KEY, GOOGLE_KEY } = process.env;

module.exports = class What3WordsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'what-3-words',
			aliases: ['what-three-words', 'w3w'],
			group: 'search',
			memberName: 'what-3-words',
			description: 'Responds with a map based upon the 3 words you provide.',
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
					key: 'location',
					prompt: 'What location would you like to get a map of? Use three nouns, like "cat.dog.parrot".',
					type: 'string',
					validate: location => {
						if (location.split('.').length === 3) return true;
						return 'Invalid location, please enter a valid location, like "cat.dog.parrot".';
					}
				}
			]
		});
	}

	async run(msg, { zoom, location }) {
		try {
			const { body } = await snekfetch
				.get('https://api.what3words.com/v2/forward')
				.query({
					addr: location,
					key: W3W_KEY
				});
			if (body.status.code === 300) return msg.say('Could not find any results.');
			const map = await snekfetch
				.get('https://maps.googleapis.com/maps/api/staticmap')
				.query({
					center: `${body.geometry.lat},${body.geometry.lng}`,
					zoom,
					size: '500x500',
					key: GOOGLE_KEY
				});
			return msg.say(`<${body.map}>`, { files: [{ attachment: map.body, name: 'what-3-words.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
