const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class SakugabooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sakugabooru',
			aliases: ['sakuga'],
			group: 'search',
			memberName: 'sakugabooru',
			description: 'Responds with an image from Sakugabooru, with optional query.',
			nsfw: true,
			credit: [
				{
					name: 'Danbooru',
					url: 'https://danbooru.donmai.us/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.sakugabooru.com/post.json')
				.query({
					tags: `${query} order:random`,
					limit: 1
				});
			if (!body.length || !body[0].file_url) return msg.say('Could not find any results.');
			return msg.say(body[0].file_url);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
