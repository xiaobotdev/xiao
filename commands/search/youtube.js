const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { GOOGLE_KEY } = process.env;

module.exports = class YouTubeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['youtube-video'],
			group: 'search',
			memberName: 'youtube',
			description: 'Searches YouTube for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What video would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch
				.get('https://www.googleapis.com/youtube/v3/search')
				.query({
					part: 'snippet',
					type: 'video',
					maxResults: 1,
					q: query,
					key: GOOGLE_KEY
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xDD2825)
				.setTitle(data.snippet.title)
				.setDescription(shorten(data.snippet.description))
				.setAuthor(`YouTube - ${data.snippet.channelTitle}`, 'https://i.imgur.com/kKHJg9Q.png')
				.setURL(`https://www.youtube.com/watch?v=${data.id.videoId}`)
				.setThumbnail(data.snippet.thumbnails.default.url);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
