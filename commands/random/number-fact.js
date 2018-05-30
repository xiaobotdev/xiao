const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class NumberFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'number-fact',
			group: 'random',
			memberName: 'number-fact',
			description: 'Responds with a random fact about a specific number.',
			args: [
				{
					key: 'number',
					prompt: 'What number do you want to get a fact for?',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { number }) {
		try {
			const { raw } = await snekfetch.get(`http://numbersapi.com/${number}`);
			return msg.say(raw.toString());
		} catch (err) {
			if (err.statusCode === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
