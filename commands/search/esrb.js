const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const ratings = {
	EC: 'Early Childhood',
	E: 'Everyone',
	E10plus: 'Everyone 10+',
	T: 'Teen',
	M: 'Mature',
	AO: 'Adults Only'
};

module.exports = class ESRBCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'esrb',
			aliases: ['esrb-rating'],
			group: 'search',
			memberName: 'esrb',
			description: 'Searches ESRB for your query.',
			args: [
				{
					key: 'query',
					prompt: 'What game would you like to get the rating of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const data = await this.fetchRating(query);
			const embed = new MessageEmbed()
				.setColor(0x231F20)
				.setAuthor('ESRB', 'https://i.imgur.com/6KAG7gD.png', 'http://www.esrb.org/')
				.setTitle(data.title)
				.setURL(data.url)
				.setThumbnail(data.ratingImage)
				.addField('❯ Rating', ratings[data.rating]);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchRating(query) {
		const { text, url } = await request
			.get('http://www.esrb.org/ratings/search.aspx')
			.query({
				from: 'home',
				titleOrPublisher: query
			});
		const title = text.match(/<strong name="title">(.+)<\/strong>/);
		if (!title) return null;
		const rating = text.match(
			/https:\/\/esrbstorage.blob.core.windows.net\/esrbcontent\/images\/(EC|E|E10plus|T|M|AO).png/
		);
		return {
			title: title[1].trim(),
			rating: rating[1],
			ratingImage: rating[0],
			url
		};
	}
};
