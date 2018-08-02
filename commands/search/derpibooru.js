const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class DerpibooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'derpibooru',
			aliases: ['derpibooru-image'],
			group: 'search',
			memberName: 'derpibooru',
			description: 'Responds with an image from Derpibooru.',
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
			const search = await request
				.get('https://derpibooru.org/search.json')
				.query({
					q: query,
					random_image: 1
				});
			if (!search.body) return msg.say('Could not find any results.');
			const { body } = await request.get(`https://derpibooru.org/images/${search.body.id}.json`);
			return msg.say(`https:${body.representations.full}`);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
