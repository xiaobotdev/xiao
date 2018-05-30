const Command = require('../../structures/Command');
const quotes = require('../../assets/json/quote');

module.exports = class QuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			group: 'random',
			memberName: 'quote',
			description: 'Responds with a random quote.'
		});
	}

	run(msg) {
		const quote = quotes[Math.floor(Math.random() * quotes.length)];
		return msg.say(`${quote.quote} - _${quote.author}_`);
	}
};
