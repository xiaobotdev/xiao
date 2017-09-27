const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { GIPHY_KEY } = process.env;

module.exports = class GiphyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giphy',
			aliases: ['gif', 'giphy-gif'],
			group: 'search',
			memberName: 'giphy',
			description: 'Searches Giphy for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What GIF would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('http://api.giphy.com/v1/gifs/search')
				.query({
					q: query,
					api_key: GIPHY_KEY,
					rating: msg.channel.nsfw ? 'r' : 'pg'
				});
			if (!body.data.length) return msg.say('Could not find any results.');
			const data = body.data[Math.floor(Math.random() * body.data.length)];
			const embed = new MessageEmbed()
				.setAuthor('Giphy', 'https://i.imgur.com/rWphUCU.jpg')
				.setColor(0x4C177F)
				.setURL(data.url)
				.setImage(data.images.original.url.replace(/\?fingerprint=.+/gi, ''))
				.addField('❯ Uploader',
					data.username || 'N/A', true)
				.addField('❯ Upload Date',
					new Date(data.import_datetime).toDateString(), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
