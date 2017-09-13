const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class NumberFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'number-fact',
			group: 'random-res',
			memberName: 'number-fact',
			description: 'Responds with a random fact about a number.',
			args: [
				{
					key: 'number',
					prompt: 'What number do you want to get a fact for?',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, args) {
		const { number } = args;
		try {
			const { text } = await snekfetch
				.get(`http://numbersapi.com/${number}`);
			return msg.say(text);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
