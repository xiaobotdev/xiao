const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { WORDNIK_KEY } = process.env;

module.exports = class WordOfTheDayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'word-of-the-day',
			aliases: ['wordnik-word-of-the-day'],
			group: 'events',
			memberName: 'word-of-the-day',
			description: 'Responds with today\'s word of the day.'
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('http://api.wordnik.com/v4/words.json/wordOfTheDay')
				.query({ api_key: WORDNIK_KEY });
			return msg.say(stripIndents`
				**${body.word}**
				(${body.definitions[0].partOfSpeech || '???'}) ${body.definitions[0].text}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
