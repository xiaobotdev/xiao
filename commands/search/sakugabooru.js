const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class SakugabooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sakugabooru',
			aliases: ['sakuga'],
			group: 'search',
			memberName: 'sakugabooru',
			description: 'Responds with an image from Sakugabooru, with optional query.',
			credit: [
				{
					name: 'Sakugabooru',
					url: 'https://www.sakugabooru.com/',
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
					tags: query,
					limit: 100
				});
			if (!body.length) return msg.say('Could not find any results.');
			const posts = body.filter(post => {
				if (!msg.channel.nsfw && (post.rating === 'e' || post.rating === 'q')) return false;
				return post.file_url;
			});
			if (!posts.length) return msg.say('Could not find any results.');
			const post = posts[Math.floor(Math.random() * posts.length)];
			return msg.say(stripIndents`
				${post.tags}
				${post.file_url}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
