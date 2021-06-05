const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class AdviceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'advice',
			aliases: ['advice-slip'],
			group: 'random-res',
			memberName: 'advice',
			description: 'Responds with a random bit of advice.',
			credit: [
				{
					name: 'Advice Slip',
					url: 'https://adviceslip.com/',
					reason: 'API',
					reasonURL: 'https://api.adviceslip.com/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('http://api.adviceslip.com/advice');
			const body = JSON.parse(text);
			return msg.say(`${body.slip.advice} (#${body.slip.id})`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
