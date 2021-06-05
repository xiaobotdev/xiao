const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class DanbooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danbooru',
			aliases: ['booru'],
			group: 'search',
			memberName: 'danbooru',
			description: 'Responds with an image from Danbooru, with optional query.',
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
					prompt: 'What image would you like to search for?',
					type: 'string',
					default: '',
					validate: query => {
						if (!query.includes(' ')) return true;
						return 'Invalid query, please only search for one tag at a time.';
					}
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://danbooru.donmai.us/posts.json')
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
