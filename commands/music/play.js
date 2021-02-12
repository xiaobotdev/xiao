const Command = require('../../structures/Command');
const request = require('node-superfetch');
const ytdl = require('ytdl-core');
const { reactIfAble } = require('../../util/Util');
const { GOOGLE_KEY } = process.env;

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			aliases: ['play-music', 'music'],
			group: 'music',
			memberName: 'play',
			description: 'Plays a YouTube video in your voice channel.',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10
			},
			userPermissions: ['CONNECT', 'SPEAK'],
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
					prompt: 'What video would you like to play? Either a URL or search query.',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const connection = this.client.voice.connections.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (this.client.dispatchers.has(msg.guild.id)) return msg.reply('I am already playing audio in this server.');
		const result = await this.searchForVideo(query, msg.channel.nsfw || false);
		if (!result) return msg.say('Could not find any results for your query.');
		const canPlay = await this.canUseVideo(result, msg.channel.nsfw || false);
		if (!canPlay) return msg.say('I cannot play this video.');
		const dispatcher = connection.play(ytdl(result, { filter: 'audioonly', quality: 'lowest' }));
		this.client.dispatchers.set(msg.guild.id, dispatcher);
		dispatcher.once('finish', () => this.client.dispatchers.delete(msg.guild.id));
		dispatcher.once('error', () => this.client.dispatchers.delete(msg.guild.id));
		await reactIfAble(msg, this.client.user, '🔉');
		return null;
	}

	async searchForVideo(query, nsfw) {
		if (ytdl.validateURL(query)) return ytdl.getURLVideoID(query);
		if (ytdl.validateID(query)) return query;
		const { body } = await request
			.get('https://www.googleapis.com/youtube/v3/search')
			.query({
				part: 'snippet',
				type: 'video',
				maxResults: 1,
				q: query,
				safeSearch: nsfw ? 'none' : 'strict',
				key: GOOGLE_KEY
			});
		if (!body.items.length) return null;
		const data = body.items[0];
		return data.id.videoId;
	}

	async canUseVideo(id, nsfw) {
		const data = await ytdl.getInfo(id);
		if (data.videoDetails.isPrivate || data.videoDetails.isLiveContent) return false;
		if (data.videoDetails.age_restricted && nsfw) return false;
		return true;
	}
};
