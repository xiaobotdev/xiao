const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class JokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joke',
			group: 'random-res',
			memberName: 'joke',
			description: 'Responds with a random joke.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://icanhazdadjoke.com/')
				.set({ Accept: 'application/json' });
			return msg.say(body.joke);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
