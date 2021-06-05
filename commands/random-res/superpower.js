const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class SuperpowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'superpower',
			group: 'random-res',
			memberName: 'superpower',
			description: 'Responds with a random superpower.',
			credit: [
				{
					name: 'Superpower Wiki',
					url: 'https://powerlisting.fandom.com/wiki/Superpower_Wiki',
					reason: 'Superpower Data'
				},
				{
					name: 'FANDOM',
					url: 'https://www.fandom.com/',
					reason: 'API',
					reasonURL: 'https://powerlisting.fandom.com/api.php'
				}
			]
		});
	}

	async run(msg) {
		try {
			const id = await this.random();
			const article = await this.fetchSuperpower(id);
			return msg.reply(stripIndents`
				Your superpower is... **${article.title}**!
				_${article.abstract.split('1')[0].trim()}_
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async random() {
		const { body } = await request
			.get('http://powerlisting.fandom.com/api.php')
			.query({
				action: 'query',
				list: 'random',
				rnnamespace: 0,
				rnlimit: 1,
				format: 'json',
				formatversion: 2
			});
		return body.query.random[0].id;
	}

	async fetchSuperpower(id) {
		const { body } = await request
			.get('https://powerlisting.fandom.com/api/v1/Articles/Details')
			.query({
				ids: id,
				abstract: 500
			});
		return body.items[id.toString()];
	}
};
