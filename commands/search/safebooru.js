const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class SafebooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safebooru',
			group: 'search',
			memberName: 'safebooru',
			description: 'Responds with an image from Safebooru, with optional query.',
			credit: [
				{
					name: 'Safebooru',
					url: 'https://safebooru.org/',
					reason: 'API'
				}
			],
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
			const { text } = await request
				.get('https://safebooru.org/index.php')
				.query({
					page: 'dapi',
					s: 'post',
					q: 'index',
					json: 1,
					tags: query,
					limit: 200
				});
			if (!text) return msg.say('Could not find any results.');
			const body = JSON.parse(text);
			const data = body[Math.floor(Math.random() * body.length)];
			return msg.say(`https://safebooru.org/images/${data.directory}/${data.image}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
