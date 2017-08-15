const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { promisify } = require('util');
const xml = promisify(require('xml2js').parseString);

module.exports = class Rule34Command extends Command {
	constructor(client) {
		super(client, {
			name: 'rule34',
			group: 'random-img',
			memberName: 'rule34',
			description: 'Searches Rule34 with optional query.',
			nsfw: true,
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

	async run(msg, args) {
		const { query } = args;
		const { text } = await snekfetch
			.get('https://rule34.xxx/index.php')
			.query({
				page: 'dapi',
				s: 'post',
				q: 'index',
				tags: query,
				limit: 200
			});
		const { posts } = await xml(text);
		if (posts.$.count === '0') return msg.say('No Results.');
		return msg.say(stripIndents`
			${query ? `Result for ${query}:` : 'Random Image:'}
			https:${posts.post[Math.floor(Math.random() * posts.post.length)].$.file_url}
		`);
	}
};
