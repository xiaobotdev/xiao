const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');
const { GOOGLE_KEY } = process.env;

module.exports = class BookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'book',
			aliases: ['google-book', 'google-books'],
			group: 'search',
			memberName: 'book',
			description: 'Searches Google Books for a book.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Books API',
					reasonURL: 'https://developers.google.com/books/'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What book would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.googleapis.com/books/v1/volumes')
				.query({
					apiKey: GOOGLE_KEY,
					q: query,
					maxResults: 1,
					printType: 'books'
				});
			if (!body.items) return msg.say('Could not find any results.');
			const data = body.items[0].volumeInfo;
			const embed = new MessageEmbed()
				.setColor(0x4285F4)
				.setTitle(data.title)
				.setURL(data.previewLink)
				.setAuthor('Google Books', 'https://i.imgur.com/N3oHABo.png', 'https://books.google.com/')
				.setDescription(data.description ? shorten(data.description) : 'No description available.')
				.setThumbnail(data.imageLinks ? data.imageLinks.thumbnail : null)
				.addField('❯ Authors', data.authors && data.authors.length ? data.authors.join(', ') : '???')
				.addField('❯ Publish Date', data.publishedDate || '???', true)
				.addField('❯ Page Count', data.pageCount ? formatNumber(data.pageCount) : '???', true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
