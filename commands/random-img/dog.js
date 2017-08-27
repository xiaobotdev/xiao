const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			group: 'random-img',
			memberName: 'dog',
			description: 'Responds with a random dog image.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://random.dog/woof.json');
			return msg.say(body.url);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
