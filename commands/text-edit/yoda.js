const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const { MASHAPE_KEY } = process.env;

module.exports = class YodaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoda',
			aliases: ['yoda-speak'],
			group: 'text-edit',
			memberName: 'yoda',
			description: 'Converts text to Yoda speak.',
			args: [
				{
					key: 'sentence',
					prompt: 'What text would you like to convert to Yoda speak?',
					type: 'string',
					validate: sentence => {
						if (sentence.length < 500) return true;
						return 'Please keep text under 500 characters.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { sentence } = args;
		try {
			const { text } = await snekfetch
				.get('https://yoda.p.mashape.com/yoda')
				.query({ sentence })
				.set({ 'X-Mashape-Key': MASHAPE_KEY });
			return msg.say(text);
		} catch (err) {
			return msg.say(`Oh no, Yoda's being a jerk and not working again: \`${err.message}\`. Try again later!`);
		}
	}
};
