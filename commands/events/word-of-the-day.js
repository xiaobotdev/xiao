const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { stripIndents } = require('common-tags');
const { WEBSTER_KEY } = process.env;

module.exports = class WordOfTheDayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'word-of-the-day',
			aliases: ['daily-word', 'wotd', 'word-of-day'],
			group: 'events',
			memberName: 'word-of-the-day',
			description: 'Responds with today\'s word of the day.',
			credit: [
				{
					name: 'Merriam-Webster\'s Collegiate® Dictionary',
					url: 'https://www.merriam-webster.com/',
					reason: 'API',
					reasonURL: 'https://dictionaryapi.com/products/api-collegiate-dictionary'
				}
			]
		});

		this.cache = null;
	}

	async run(msg) {
		const word = await this.fetchWordOfTheDay();
		let data;
		if (this.cache?.word === word) {
			data = this.cache.data;
		} else {
			const { body } = await request
				.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`)
				.query({ key: WEBSTER_KEY });
			data = body[0];
			this.cache = { word, data };
		}
		return msg.say(stripIndents`
			**${data.meta.stems[0]}** (${data.fl})
			${data.shortdef.map((definition, i) => `(${i + 1}) ${definition}`).join('\n')}
		`);
	}

	async fetchWordOfTheDay() {
		const { text } = await request.get('https://www.merriam-webster.com/word-of-the-day');
		const $ = cheerio.load(text);
		return $('div[class="word-and-pronunciation"]').first().children().first().text();
	}
};
