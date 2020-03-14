const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { FLICKR_KEY } = process.env;

module.exports = class FlickrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'flickr',
			group: 'search',
			memberName: 'flickr',
			description: 'Searches Flickr for your query... Maybe.',
			nsfw: true,
			credit: [
				{
					name: 'Flickr',
					url: 'https://www.flickr.com/',
					reason: 'API',
					reasonURL: 'https://www.flickr.com/services/api/'
				}
			],
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
			const { body } = await request
				.get('https://api.flickr.com/services/rest/')
				.query({
					api_key: FLICKR_KEY,
					format: 'json',
					method: 'flickr.photos.search',
					text: query,
					nojsoncallback: true
				});
			if (!body.photos.photo.length) return msg.say('Could not find any results.');
			const data = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
			return msg.say(`https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}.jpg`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
