const Command = require('../../framework/Command');
const request = require('node-superfetch');
const nsfwCategories = ['explicit'];

module.exports = class ChuckNorrisCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chuck-norris',
			aliases: ['norris'],
			group: 'random-res',
			memberName: 'chuck-norris',
			description: 'Responds with a random Chuck Norris joke.',
			credit: [
				{
					name: 'Chuck Norris',
					url: 'https://chucknorris.com/',
					reason: 'Himself'
				},
				{
					name: 'chucknorris.io',
					url: 'https://api.chucknorris.io/',
					reason: 'API',
					reasonURL: 'https://api.chucknorris.io/'
				}
			]
		});

		this.categories = null;
	}

	async run(msg) {
		if (!this.categories) await this.fetchCategories();
		const categories = msg.channel.nsfw
			? this.categories
			: this.categories.filter(cat => !nsfwCategories.includes(cat));
		const { body } = await request
			.get('https://api.chucknorris.io/jokes/random')
			.query({ category: categories.join(',') });
		return msg.say(body.value);
	}

	async fetchCategories() {
		if (this.categories) return this.categories;
		const { body } = await request.get('https://api.chucknorris.io/jokes/categories');
		this.categories = body;
		return this.categories;
	}
};
