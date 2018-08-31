const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { YODA_KEY } = process.env;

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
					prompt: 'What sentence would you like to convert to Yoda speak?',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { sentence }) {
		try {
			const { body } = await request
				.get('https://yoda-speak-api.herokuapp.com/speak')
				.query({
					text: sentence,
					token: YODA_KEY
				});
			if (!body.response) return msg.reply('Empty, this message is. Try again later, you must.');
			return msg.say(body.response);
		} catch (err) {
			return msg.reply(`Being a jerk again, Yoda is: \`${err.message}\`. Try again later, you must.`);
		}
	}
};
