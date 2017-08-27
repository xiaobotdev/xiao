const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class ChuckNorrisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chuck-norris',
			aliases: ['chuck', 'norris'],
			group: 'random-res',
			memberName: 'chuck-norris',
			description: 'Responds with a Chuck Norris quote.',
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

	async run(msg, args) {
		const { name } = args;
		try {
			const { body } = await snekfetch
				.get('http://api.icndb.com/jokes/random')
				.query({
					escape: 'javascript',
					firstName: name
				});
			return msg.say(body.value.joke);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
