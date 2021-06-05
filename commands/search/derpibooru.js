const Command = require('../../framework/Command');
const request = require('node-superfetch');

module.exports = class DerpibooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'derpibooru',
			aliases: ['derpi'],
			group: 'search',
			memberName: 'derpibooru',
			description: 'Responds with an image from Derpibooru.',
			credit: [
				{
					name: 'Hasbro',
					url: 'https://shop.hasbro.com/en-us',
					reason: 'Original "My Little Pony: Friendship is Magic" Show',
					reasonURL: 'https://mylittlepony.hasbro.com/en-us'
				},
				{
					name: 'Derpibooru',
					url: 'https://derpibooru.org/',
					reason: 'API',
					reasonURL: 'https://www.derpibooru.org/pages/api'
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
			const url = await this.search(query, msg.channel.nsfw || false);
			if (!url) return msg.say('Could not find any results.');
			if (url === 'nsfw') return msg.say('The image I found was NSFW, and this isn\'t the channel for that.');
			return msg.say(url);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query, nsfw) {
		const { body } = await request
			.get('https://derpibooru.org/api/v1/json/search')
			.query({
				q: query,
				per_page: 1,
				sf: 'random'
			});
		if (!body || !body.images || !body.images.length) return null;
		const image = body.images[0];
		if (!image.tags.includes('safe') && !nsfw) return 'nsfw';
		return image.representations.full;
	}
};
