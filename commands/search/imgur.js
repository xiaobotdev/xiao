const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { IMGUR_KEY } = process.env;

module.exports = class ImgurCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'imgur',
			group: 'search',
			memberName: 'imgur',
			description: 'Searches Imgur for your query.',
			credit: [
				{
					name: 'Imgur',
					url: 'https://imgur.com/',
					reason: 'API',
					reasonURL: 'https://apidocs.imgur.com/'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://api.imgur.com/3/gallery/search')
				.query({ q: query })
				.set({ Authorization: `Client-ID ${IMGUR_KEY}` });
			const images = body.data.filter(image => image.images && (msg.channel.nsfw ? true : !image.nsfw));
			if (!images.length) return msg.say('Could not find any results.');
			return msg.say(images[Math.floor(Math.random() * images.length)].images[0].link);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
