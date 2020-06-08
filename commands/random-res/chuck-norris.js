const Command = require('../../structures/Command');
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
					name: 'The Internet Chuck Norris Database',
					url: 'http://www.icndb.com/',
					reason: 'API',
					reasonURL: 'http://www.icndb.com/api/'
				}
			],
			args: [
				{
					key: 'name',
					prompt: 'What would you like the name to be?',
					type: 'string',
					default: 'Chuck'
				}
			]
		});
	}

	async run(msg, { name }) {
		try {
			const { body } = await request
				.get('http://api.icndb.com/jokes/random')
				.query({
					escape: 'javascript',
					firstName: name,
					exclude: msg.channel.nsfw ? '' : '[explicit]'
				});
			return msg.say(body.value.joke);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
