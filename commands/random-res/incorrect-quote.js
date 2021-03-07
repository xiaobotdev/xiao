const Command = require('../../structures/Command');
const quotes = require('../../assets/json/incorrect-quote');

module.exports = class IncorrectQuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'incorrect-quote',
			aliases: ['fake-quote', 'i-quote', 'f-quote', 'fq', 'scatter-patter'],
			group: 'random-res',
			memberName: 'incorrect-quote',
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
					prompt: 'What characters do you want to use? Up to 6.',
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
		return quote
			.replace(/\{A\}/g, characters[0])
			.replace(/\{B\}/g, characters[1])
			.replace(/\{C\}/g, characters[2])
			.replace(/\{D\}/g, characters[3])
			.replace(/\{E\}/g, characters[4])
			.replace(/\{F\}/g, characters[5])
			.replace(/\{G\}/g, characters[0].toUpperCase())
			.replace(/\{H\}/g, characters[1].toUpperCase())
			.replace(/\{I\}/g, characters[2].toUpperCase())
			.replace(/\{J\}/g, characters[3].toUpperCase())
			.replace(/\{K\}/g, characters[4].toUpperCase())
			.replace(/\{L\}/g, characters[5].toUpperCase());
	}
};
