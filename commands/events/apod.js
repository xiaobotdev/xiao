const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { shorten } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const { GOV_KEY } = process.env;

module.exports = class ApodCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apod',
			aliases: ['astronomy-picture-of-the-day'],
			group: 'events',
			memberName: 'apod',
			description: 'Responds with today\'s Astronomy Picture of the Day.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'APOD API',
					reasonURL: 'https://api.nasa.gov/'
				}
			]
		});
	}

	async run(msg) {
		const { body } = await request
			.get('https://api.nasa.gov/planetary/apod')
			.query({ api_key: GOV_KEY });
		const embed = new EmbedBuilder()
			.setTitle(body.title)
			.setDescription(shorten(body.explanation))
			.setColor(0x2E528E)
			.setAuthor({
				name: 'Astronomy Picture of the Day',
				iconURL: logos.nasa,
				url: 'https://apod.nasa.gov/apod/astropix.html'
			})
			.setImage(body.media_type === 'image' ? body.url : null)
			.setURL(body.url)
			.setFooter({ text: `Image Credits: ${body.copyright ? body.copyright.replaceAll('\n', '/') : 'Public Domain'}` })
			.setTimestamp();
		return msg.embed(embed);
	}
};
