const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class YodaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yoda',
			aliases: ['yoda-speak'],
			group: 'edit-text',
			memberName: 'yoda',
			description: 'Converts text to Yoda speak.',
			credit: [
				{
					name: 'richchurcher',
					url: 'https://github.com/richchurcher',
					reason: 'API',
					reasonURL: 'https://github.com/richchurcher/yoda-api'
				}
			],
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
				.get('https://yoda-api.appspot.com/api/v1/yodish')
				.query({ text: sentence });
			if (!body.yodish) return msg.reply('Empty, this message is. Try again later, you must.');
			return msg.say(body.yodish);
		} catch (err) {
			return msg.reply(`Being a jerk again, Yoda is: \`${err.message}\`. Try again later, you must.`);
		}
	}
};
