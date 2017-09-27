const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { FLICKR_KEY } = process.env;

module.exports = class FlickrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'flickr',
			aliases: ['flickr-image'],
			group: 'search',
			memberName: 'flickr',
			description: 'Searches Flickr for your query.',
			clientPermissions: ['EMBED_LINKS'],
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
			const data = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
			const embed = new MessageEmbed()
				.setAuthor('Flickr', 'https://i.imgur.com/8QPPlV9.png')
				.setColor(0x0059D4)
				.setImage(`https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}.jpg`)
				.setTitle(data.title)
				.setURL(`https://www.flickr.com/photos/${data.owner}/${data.id}`);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
