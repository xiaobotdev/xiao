const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class AdviceSlipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'advice-slip',
			aliases: ['advice'],
			group: 'random',
			memberName: 'advice-slip',
			description: 'Responds with a random bit of advice.'
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get('http://api.adviceslip.com/advice');
			return msg.say(JSON.parse(text).slip.advice);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
