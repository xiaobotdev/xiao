const Command = require('../../structures/Command');
const quotes = require('../../assets/json/quote');

module.exports = class QuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			group: 'random-res',
			memberName: 'quote',
			description: 'Responds with a random quote.',
			credit: [
				{
					name: 'Luke Peavey',
					url: 'https://github.com/lukePeavey',
					reason: 'Quotes Data',
					reasonURL: 'https://github.com/lukePeavey/quotable/blob/master/data/sample/quotes.json'
				}
			]
		});
	}

	run(msg) {
		const quote = quotes[Math.floor(Math.random() * quotes.length)];
		return msg.say(`${quote.content} - _${quote.author}_`);
	}
};
