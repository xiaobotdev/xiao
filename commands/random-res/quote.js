const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class QuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'quote',
			group: 'random-res',
			memberName: 'quote',
			description: 'Responds with a random quote.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://talaikis.com/api/quotes/random/');
			return msg.say(`${body.quote} - _${body.author}_`);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
