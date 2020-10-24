const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');
// eslint-disable-next-line max-len
const top = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->';
const bottom = '<!-- MxM banner -->';
const lyricRegex = new RegExp(`${top}(.+)${bottom}`, 'si');

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lyrics',
			aliases: ['az-lyrics'],
			group: 'search',
			memberName: 'lyrics',
			description: 'Responds with lyrics to a song.',
			credit: [
				{
					name: 'AZLyrics',
					url: 'https://www.azlyrics.com/',
					reason: 'Lyrics Data'
				}
			],
			args: [
				{
					key: 'artist',
					prompt: 'What artist would you like to get the lyrics of?',
					type: 'string',
					parse: artist => artist.replace(/[^A-Za-z0-9]+|^(the )/gi, '').toLowerCase()
				},
				{
					key: 'song',
					prompt: 'What song would you like to get the lyrics of?',
					type: 'string',
					parse: song => song.replace(/[^A-Za-z0-9]+/g, '').toLowerCase()
				}
			]
		});
	}

	async run(msg, { artist, song }) {
		try {
			const lyrics = await this.getLyrics(artist, song);
			const url = `https://www.azlyrics.com/lyrics/${artist}/${song}.html`;
			return msg.say(`${shorten(lyrics, 1750)}\n\n**Read the Rest:** ${url}`);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async getLyrics(artist, song) {
		const { text } = await request.get(`https://www.azlyrics.com/lyrics/${artist}/${song}.html`);
		const lyrics = text.match(lyricRegex)[1];
		return lyrics
			.replaceAll('<br>', '')
			.replace(/<\/?div>/g, '')
			.trim();
	}
};
