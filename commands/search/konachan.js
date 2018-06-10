const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class KonachanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'konachan',
			aliases: ['konachan-image'],
			group: 'search',
			memberName: 'konachan',
			description: 'Responds with an image from Konachan, with optional query.',
			nsfw: true,
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://konachan.net/post.json')
				.query({
					tags: `${query} order:random`,
					limit: 1
				});
			if (!body.length || !body[0].file_url) return msg.say('Could not find any results.');
			return msg.say(`https:${body[0].file_url}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
