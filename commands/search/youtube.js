const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class YoutubeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['y-tube', 'u-tube', 'yt'],
			group: 'search',
			memberName: 'youtube',
			description: 'Searches YouTube for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'YouTube Data API',
					reasonURL: 'https://developers.google.com/youtube/v3/'
				}
			],
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
			const { body } = await request
				.get('https://www.googleapis.com/youtube/v3/search')
				.query({
					part: 'snippet',
					type: 'video',
					maxResults: 1,
					q: query,
					safeSearch: msg.channel.nsfw ? 'none' : 'strict',
					key: GOOGLE_KEY
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xDD2825)
				.setTitle(data.snippet.title)
				.setDescription(data.snippet.description)
				.setAuthor('YouTube', 'https://i.imgur.com/kKHJg9Q.png', 'https://www.youtube.com/')
				.setURL(`https://www.youtube.com/watch?v=${data.id.videoId}`)
				.setThumbnail(data.snippet.thumbnails.default ? data.snippet.thumbnails.default.url : null)
				.addField('❯ ID', data.id.videoId, true)
				.addField('❯ Publish Date', moment.utc(data.snippet.publishedAt).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Channel', data.snippet.channelTitle, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
