const Command = require('../../structures/Command');
const request = require('node-superfetch');
const moment = require('moment');
const { base64 } = require('../../util/Util');

module.exports = class FrinkiacCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'frinkiac',
			aliases: ['the-simpsons', 'simpsons', 'simpson'],
			group: 'search',
			memberName: 'frinkiac',
			description: 'Input a line from the Simpsons to get the episode/season.',
			credit: [
				{
					name: 'Frinkiac',
					url: 'https://frinkiac.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What line would you like to look up?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const search = await this.search(query);
			if (!search) return msg.say('Could not find any results.');
			const data = await this.fetchCaption(search.Episode, search.Timestamp);
			const time = moment.duration(data.Frame.Timestamp).format();
			const caption = data.Subtitles.map(sub => sub.Content).join(' ').split(' ');
			let url = `https://frinkiac.com/meme/${data.Frame.Episode}/${data.Frame.Timestamp}.jpg`;
			const wrapped = [''];
			let currentLine = 0;
			for (const word of caption) {
				if (wrapped[currentLine].length + word.length < 26) {
					wrapped[currentLine] += ` ${word}`;
				} else {
					wrapped.push(` ${word}`);
					currentLine++;
				}
			}
			url += `?b64lines=${base64(wrapped.join('\n')).replace(/\//g, '_')}`;
			const seasonEpisode = `S${data.Episode.Season}E${data.Episode.EpisodeNumber}`;
			return msg.say(
				`This is from **${seasonEpisode} ("${data.Episode.Title}") @ ${time}**.`,
				{ files: [url] }
			);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://frinkiac.com/api/search')
			.query({ q: query });
		if (!body.length) return null;
		return body[0];
	}

	async fetchCaption(ep, ts) {
		const { body } = await request
			.get('https://frinkiac.com/api/caption')
			.query({
				e: ep,
				t: ts
			});
		return body;
	}
};
