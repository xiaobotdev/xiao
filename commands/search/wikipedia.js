const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class WikipediaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wikipedia',
			group: 'search',
			memberName: 'wikipedia',
			description: 'Searches Wikipedia for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Wikipedia',
					url: 'https://www.wikipedia.org/',
					reason: 'API',
					reasonURL: 'https://en.wikipedia.org/w/api.php'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://en.wikipedia.org/w/api.php')
				.query({
					action: 'query',
					prop: 'extracts|pageimages',
					format: 'json',
					titles: query,
					exintro: '',
					explaintext: '',
					pithumbsize: 150,
					redirects: '',
					formatversion: 2
				});
			const data = body.query.pages[0];
			if (data.missing) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xE7E7E7)
				.setTitle(data.title)
				.setAuthor('Wikipedia', 'https://i.imgur.com/Z7NJBK2.png', 'https://www.wikipedia.org/')
				.setThumbnail(data.thumbnail ? data.thumbnail.source : null)
				.setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(query).replaceAll(')', '%29')}`)
				.setDescription(shorten(data.extract.replaceAll('\n', '\n\n')));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
