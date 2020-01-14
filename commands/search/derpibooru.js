const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DerpibooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'derpibooru',
			group: 'search',
			memberName: 'derpibooru',
			description: 'Responds with an image from Derpibooru.',
			credit: [
				{
					name: 'Derpibooru',
					url: 'https://derpibooru.org/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What image would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const id = await this.search(query);
			if (!id) return msg.say('Could not find any results.');
			const url = await this.fetchImage(id);
			return msg.say(url);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://derpibooru.org/search.json')
			.query({
				q: query,
				random_image: 1
			});
		if (!body) return null;
		return body.id;
	}

	async fetchImage(id) {
		const { body } = await request.get(`https://derpibooru.org/images/${id}.json`);
		return `http:${body.representations.full}`;
	}
};
