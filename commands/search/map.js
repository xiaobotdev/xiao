const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class MapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'map',
			aliases: ['google-maps', 'google-map'],
			group: 'search',
			memberName: 'map',
			description: 'Responds with a map of a specific location.',
			clientPermissions: ['ATTACH_FILES'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Maps Static API',
					reasonURL: 'https://developers.google.com/maps/documentation/maps-static/intro'
				}
			],
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
					prompt: 'What location would you like to get a map of?',
					type: 'string',
					validate: location => {
						if (encodeURIComponent(location).length < 1950) return true;
						return 'Invalid location, your location is too long.';
					}
				}
			]
		});
	}

	async run(msg, { zoom, location }) {
		try {
			const { body } = await request
				.get('https://maps.googleapis.com/maps/api/staticmap')
				.query({
					center: location,
					zoom,
					size: '500x500',
					key: GOOGLE_KEY
				});
			const url = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
			return msg.say(`<${url}>`, { files: [{ attachment: body, name: 'map.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
