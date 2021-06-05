const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class PornhubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pornhub',
			group: 'search',
			memberName: 'pornhub',
			description: 'Searches Pornhub for your query.',
			nsfw: true,
			credit: [
				{
					name: 'Pornhub',
					url: 'https://www.pornhub.com/',
					reason: 'Video Data'
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
			const url = await this.search(query);
			if (!url) return msg.say('Could not find any results.');
			return msg.say(url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.get(`https://www.pornhub.com/video/search`)
			.query({ search: query });
		if (text.includes('<div class="noResultsWrapper">')) return null;
		const $ = cheerio.load(text);
		const video = $('li[class="pcVideoListItem js-pop videoblock videoBox"]').eq(5);
		return `https://www.pornhub.com/view_video.php?viewkey=${video.attr('data-video-vkey')}`;
	}
};
