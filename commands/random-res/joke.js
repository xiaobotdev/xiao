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
		const { body } = await snekfetch
			.get('https://icanhazdadjoke.com/')
			.set({ Accept: 'application/json' });
		return msg.say(body.joke);
	}
};
