const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { shorten, embedURL } = require('../../util/Util');

module.exports = class NASACommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nasa',
			group: 'search',
			memberName: 'nasa',
			description: 'Searches NASA\'s image archive for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'NASA Image and Video Library API',
					reasonURL: 'https://api.nasa.gov/'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const { body } = await request
			.get('https://images-api.nasa.gov/search')
			.query({
				q: query,
				media_type: 'image'
			});
		const images = body.collection.items;
		if (!images.length) return msg.say('Could not find any results.');
		const data = images[Math.floor(Math.random() * images.length)];
		const embed = new MessageEmbed()
			.setTitle(shorten(data.data[0].title, 256))
			.setDescription(shorten(this.cleanHTML(data.data[0].description)))
			.setColor(0x2E528E)
			.setAuthor('NASA', 'https://i.imgur.com/Wh8jY9c.png', 'https://www.nasa.gov/multimedia/imagegallery/index.html')
			.setImage(`https://images-assets.nasa.gov/image/${data.data[0].nasa_id}/${data.data[0].nasa_id}~thumb.jpg`)
			.setFooter(`Image Credits: ${data.data[0].center || 'Public Domain'}`)
			.setTimestamp(new Date(data.data[0].date_created));
		return msg.embed(embed);
	}

	cleanHTML(text) {
		return text
			.replace(/<\/?b>/g, '**')
			.replace(/<\/?i>/g, '*')
			.replace(/<a href="(https?:\/\/[^ ]+)" rel="nofollow">([^<>]+)<\/a>/g, embedURL('$2', '$1'));
	}
};
