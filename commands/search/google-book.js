const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { GOOGLE_KEY } = process.env;

module.exports = class GoogleBookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'google-book',
			aliases: ['google-books', 'book'],
			group: 'search',
			memberName: 'google-book',
			description: 'Searches Google Books for a book.',
			clientPermissions: ['EMBED_LINKS'],
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
			const { body } = await snekfetch
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
				.setAuthor('Google Books', 'https://i.imgur.com/N3oHABo.png')
				.setDescription(data.description ? shorten(data.description) : 'No description available.')
				.setThumbnail(data.imageLinks ? data.imageLinks.thumbnail : null)
				.addField('❯ Authors',
					data.authors.length ? data.authors.join(', ') : '???')
				.addField('❯ Publish Date',
					data.publishedDate || '???', true)
				.addField('❯ Page Count',
					data.pageCount || '???', true)
				.addField('❯ Genres',
					data.categories.length ? data.categories.join(', ') : '???');
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
