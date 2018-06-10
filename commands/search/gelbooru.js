const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GelbooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gelbooru',
			aliases: ['gelbooru-image'],
			group: 'search',
			memberName: 'gelbooru',
			description: 'Responds with an image from Gelbooru, with optional query.',
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
				.get('https://gelbooru.com/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					json: 1,
					tags: query,
					limit: 200
				});
			if (!body) return msg.say('Could not find any results.');
			return msg.say(body[Math.floor(Math.random() * body.length)].file_url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
