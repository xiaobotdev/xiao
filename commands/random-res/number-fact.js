const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class NumberFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'number-fact',
			aliases: ['num-fact'],
			group: 'random-res',
			memberName: 'number-fact',
			description: 'Responds with a random fact about a specific number.',
			credit: [
				{
					name: 'Numbers API',
					url: 'http://numbersapi.com/',
					reason: 'Trivia API'
				}
			],
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
			const { text } = await request.get(`http://numbersapi.com/${number}`);
			return msg.say(text);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
