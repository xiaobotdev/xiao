const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class ChuckNorrisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chuck-norris',
			aliases: ['norris'],
			group: 'random-res',
			memberName: 'chuck-norris',
			description: 'Responds with a random Chuck Norris joke.',
			credit: [
				{
					name: 'Chuck Norris',
					url: 'https://chucknorris.com/',
					reason: 'Himself'
				},
				{
					name: 'chucknorris.io',
					url: 'https://api.chucknorris.io/',
					reason: 'API',
					reasonURL: 'https://api.chucknorris.io/'
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await request.get('https://api.chucknorris.io/jokes/random');
			return msg.say(body.value);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
