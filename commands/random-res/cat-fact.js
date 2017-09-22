const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class CatFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cat-fact',
			aliases: ['neko-fact'],
			group: 'random-res',
			memberName: 'cat-fact',
			description: 'Responds with a cat fact.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://catfact.ninja/fact')
				.query({ max_length: 2000 });
			return msg.say(body.fact);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
