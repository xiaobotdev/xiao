const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { shorten } = require('../../util/Util');
const { UNSPLASH_KEY } = process.env;

module.exports = class StockPhotoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stock-photo',
			aliases: ['unsplash', 'stock-image', 'stock-img'],
			group: 'search',
			memberName: 'stock-photo',
			description: 'Searches for stock photos based on your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Unsplash',
					url: 'https://unsplash.com/',
					reason: 'API',
					reasonURL: 'https://unsplash.com/developers'
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
				.get('https://api.unsplash.com/photos/random')
				.set({ Authorization: `Client-ID ${UNSPLASH_KEY}` })
				.query({
					query,
					content_filter: msg.channel.nsfw ? 'low' : 'high'
				});
			const embed = new MessageEmbed()
				.setTitle(body.description ? shorten(body.description, 256) : 'Unnamed Image')
				.setURL(body.links.download)
				.setColor(body.color)
				.setAuthor(body.user.name || body.user.username, undefined, body.user.links.html)
				.setImage(body.urls.raw)
				.setFooter(`Photo by ${body.user.name || body.user.username} on Unsplash`)
				.setTimestamp(new Date(body.updated_at));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
