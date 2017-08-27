const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');

module.exports = class NeopetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neopet',
			group: 'search',
			memberName: 'neopet',
			description: 'Searches for Neopets with the username of your query.',
			args: [
				{
					key: 'query',
					prompt: 'What pet would you like to get an image of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const { query } = args;
		try {
			const { text } = await snekfetch
				.get('http://www.sunnyneo.com/petimagefinder.php')
				.query({
					name: query,
					size: 5,
					mood: 1
				});
			const link = text.match(/http:\/\/pets\.neopets\.com\/cp\/.+\.png/);
			if (!link) return msg.say('Could not find any results.');
			return msg.say(link[0]);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
