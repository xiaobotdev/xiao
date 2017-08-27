const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class MapCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'map',
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
					validate: zoom => {
						if (zoom < 21 && zoom > 0) return true;
						return 'Please enter a zoom value from 1-20.';
					}
				},
				{
					key: 'query',
					prompt: 'What location would you like to get a map of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { zoom, query } = args;
		try {
			const { body } = await snekfetch
				.get('https://maps.googleapis.com/maps/api/staticmap')
				.query({
					center: query,
					zoom,
					size: '500x500',
					key: GOOGLE_KEY
				});
			return msg.say({ files: [{ attachment: body, name: 'map.png' }] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
