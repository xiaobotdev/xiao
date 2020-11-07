const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { html } = require('common-tags');
const { shorten } = require('../../util/Util');

module.exports = class PoemCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'poem',
			aliases: ['poetry'],
			group: 'search',
			memberName: 'poem',
			description: 'Searches for poems by a specific author.',
			credit: [
				{
					name: 'PoetryDB',
					url: 'https://poetrydb.org/index.html',
					reason: 'API',
					reasonURL: 'https://github.com/thundercomb/poetrydb/blob/master/README.md'
				}
			],
			args: [
				{
					key: 'author',
					prompt: 'What author would you like to get a poem from?',
					type: 'string',
					parse: author => encodeURIComponent(author)
				},
				{
					key: 'title',
					prompt: 'What is the title of the poem you want to get?',
					type: 'string',
					parse: title => encodeURIComponent(title)
				}
			]
		});
	}

	async run(msg, { author, title }) {
		try {
			const { body } = await request.get(`https://poetrydb.org/author,title/${author};${title}`);
			if (body.status === 404) return msg.say('Could not find any results.');
			const data = body[0];
			return msg.say(html`
				**${data.title}** by **${data.author}**
				${shorten(data.lines.join('\n'), 1750)}
			`);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
