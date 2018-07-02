const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');

module.exports = class WikihowCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikihow',
			aliases: ['wikihow-article', 'how-to', 'how'],
			group: 'search',
			memberName: 'wikihow',
			description: 'Searches Wikihow for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string',
					parse: query => query.replace(/^((how )?to )/i, '')
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.wikihow.com/api.php')
				.query({
					action: 'query',
					prop: 'info',
					format: 'json',
					titles: query,
					inprop: 'url',
					redirects: ''
				});
			const data = body.query.pages[Object.keys(body.query.pages)[0]];
			if (data.missing === '') return msg.say('Could not find any results.');
			return msg.say(stripIndents`
				How to ${data.title}
				${data.fullurl}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
