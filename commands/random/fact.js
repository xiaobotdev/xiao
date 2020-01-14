const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class FactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fact',
			group: 'random',
			memberName: 'fact',
			description: 'Responds with a random fact.',
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'API',
					reasonURL: 'https://en.wikipedia.org/w/api.php'
				}
			]
		});
	}

	async run(msg) {
		try {
			const article = await this.randomWikipediaArticle();
			const { body } = await request
				.get('https://en.wikipedia.org/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts',
					format: 'json',
					titles: article,
					exintro: '',
					explaintext: '',
					redirects: '',
					formatversion: 2
				});
			let fact = body.query.pages[0].extract;
			if (fact.length > 200) {
				const facts = fact.split('.');
				fact = `${facts[0]}.`;
				if (fact.length < 200 && facts.length > 1) fact += `${facts[1]}.`;
			}
			return msg.say(fact);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async randomWikipediaArticle() {
		const { body } = await request
			.get('https://en.wikipedia.org/w/api.php')
			.query({
				action: 'query',
				list: 'random',
				rnnamespace: 0,
				rnlimit: 1,
				format: 'json',
				formatversion: 2
			});
		if (!body.query.random[0].title) return 'Facts are hard to find sometimes.';
		return body.query.random[0].title;
	}
};
