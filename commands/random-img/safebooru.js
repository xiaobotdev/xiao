const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const xml = promisifyAll(require('xml2js'));

module.exports = class SafebooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safebooru',
			group: 'random-img',
			memberName: 'safebooru',
			description: 'Searches Safebooru with optional query.',
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
			.get('http://safebooru.org/index.php')
			.query({
				page: 'dapi',
				s: 'post',
				q: 'index',
				tags: query,
				limit: 200
			});
		const { posts } = await xml.parseStringAsync(text);
		if (posts.$.count === '0') return msg.say('No Results.');
		return msg.say(stripIndents`
			${query ? `Result for ${query}:` : 'Random Image:'}
			http:${posts.post[Math.floor(Math.random() * posts.post.length)].$.file_url}
		`);
	}
};
