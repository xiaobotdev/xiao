const Command = require('../../framework/Command');
const quotes = require('../../assets/json/incorrect-quote');

module.exports = class IncorrectQuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'incorrect-quote',
			aliases: ['fake-quote', 'i-quote', 'f-quote', 'fq', 'scatter-patter'],
			group: 'random-res',
			description: 'Generates an incorrect quote.',
			credit: [
				{
					name: 'ScatterPatter\'s Incorrect Quotes Generator',
					url: 'https://incorrect-quotes-generator.neocities.org/',
					reason: 'Quote Data'
				}
			],
			args: [
				{
					key: 'characters',
					type: 'string',
					max: 20,
					infinite: true
				}
			]
		});
	}

	run(msg, { characters }) {
		if (characters.length > 6) return msg.reply('Please do not enter more than 6 characters.');
		const validQuotes = quotes[characters.length - 1];
		const quote = validQuotes[Math.floor(Math.random() * validQuotes.length)];
		return msg.say(this.replaceCharacters(quote, characters));
	}

	replaceCharacters(quote, characters) {
		quote = quote.replace(/\{A\}/g, characters[0]).replace(/\{G\}/g, characters[0].toUpperCase());
		if (characters.length >= 2) {
			quote = quote.replace(/\{B\}/g, characters[1]).replace(/\{H\}/g, characters[1].toUpperCase());
		}
		if (characters.length >= 3) {
			quote = quote.replace(/\{C\}/g, characters[2]).replace(/\{I\}/g, characters[2].toUpperCase());
		}
		if (characters.length >= 4) {
			quote = quote.replace(/\{D\}/g, characters[3]).replace(/\{J\}/g, characters[3].toUpperCase());
		}
		if (characters.length >= 5) {
			quote = quote.replace(/\{E\}/g, characters[4]).replace(/\{K\}/g, characters[4].toUpperCase());
		}
		if (characters.length >= 6) {
			quote = quote.replace(/\{F\}/g, characters[5]).replace(/\{L\}/g, characters[5].toUpperCase());
		}
		return quote;
	}
};
