const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { shorten, embedURL } = require('../../util/Util');
const logos = require('../../assets/json/logos');

module.exports = class NASACommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nasa',
			group: 'search',
			memberName: 'nasa',
			description: 'Searches NASA\'s image archive for your query.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
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
		const embed = new EmbedBuilder()
			.setTitle(shorten(data.data[0].title, 256))
			.setDescription(shorten(this.cleanHTML(data.data[0].description)))
			.setColor(0x2E528E)
			.setAuthor({ name: 'NASA', iconURL: logos.nasa, url: 'https://www.nasa.gov/multimedia/imagegallery/index.html' })
			.setImage(`https://images-assets.nasa.gov/image/${data.data[0].nasa_id}/${data.data[0].nasa_id}~thumb.jpg`)
			.setFooter({ text: `Image Credits: ${data.data[0].center || 'Public Domain'}` })
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
