const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class DogFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog-fact',
			group: 'random-res',
			memberName: 'dog-fact',
			description: 'Responds with a dog fact.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://dog-api.kinduff.com/api/facts');
			return msg.say(body.facts[0]);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
