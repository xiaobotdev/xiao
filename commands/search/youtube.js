const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class YouTubeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
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

	async run(msg, args) {
		const { query } = args;
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
			const embed = new MessageEmbed()
				.setColor(0xDD2825)
				.setTitle(body.items[0].snippet.title)
				.setDescription(body.items[0].snippet.description)
				.setAuthor(`YouTube - ${body.items[0].snippet.channelTitle}`, 'https://i.imgur.com/hkUafwu.png')
				.setURL(`https://www.youtube.com/watch?v=${body.items[0].id.videoId}`)
				.setThumbnail(body.items[0].snippet.thumbnails.default.url);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
