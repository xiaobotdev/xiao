const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { delay } = require('../../util/Util');

module.exports = class SuperpowerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'superpower',
			group: 'random-res',
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
		const id = await this.random();
		return msg.reply(stripIndents`
			Your superpower is... **${article.title}**!
			https://powerlisting.fandom.com/wiki/${title.replace(/ /g, '_')}
		`);
	}

	async random() {
		let retries = 0;
		try {
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
			return body.query.random[0].title;
		} catch (err) {
			if (err.status === 403 && retries < 6) {
				await delay(500);
				retries++;
				this.random();
			}
			throw err;
		}
	}
};
