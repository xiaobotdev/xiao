const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class ChuckNorrisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chuck-norris',
			aliases: ['chuck', 'norris'],
			group: 'random',
			memberName: 'chuck-norris',
			description: 'Responds with a random Chuck Norris joke.',
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
					firstName: name
				});
			return msg.say(body.value.joke);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
