const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { FLICKR_KEY } = process.env;

module.exports = class FlickrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'flickr',
			group: 'search',
			memberName: 'flickr',
			description: 'Searches Flickr for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What photo would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://api.flickr.com/services/rest/')
				.query({
					api_key: FLICKR_KEY,
					format: 'json',
					method: 'flickr.photos.search',
					text: query,
					nojsoncallback: true
				});
			if (!body.photos.photo.length) return msg.say('Could not find any results.');
			const photo = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
			return msg.say(`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
