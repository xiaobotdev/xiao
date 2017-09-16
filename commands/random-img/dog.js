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
				.get('https://dog.ceo/api/breeds/image/random');
			return msg.say({ files: [body.message] });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
