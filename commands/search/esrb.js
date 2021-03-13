const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const path = require('path');
const { shorten } = require('../../util/Util');

module.exports = class EsrbCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'esrb',
			aliases: ['game-rating'],
			group: 'search',
			memberName: 'esrb',
			description: 'Searches ESRB for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'ESRB',
					url: 'https://www.esrb.org/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What game would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const data = await this.search(query);
			if (!data) return msg.say('Could not find any results.');
			const ratingFile = path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', `${data.rating}.png`);
			const embed = new MessageEmbed()
				.attachFiles([{ attachment: ratingFile, name: 'rating.png' }])
				.setColor(0x1C8CDE)
				.setTitle(`${data.title} by ${data.company}`)
				.setDescription(data.descriptors || 'No Descriptors')
				.setAuthor('ESRB', 'https://i.imgur.com/29U6Bax.jpg', 'https://www.esrb.org/')
				.setThumbnail('attachment://rating.png')
				.setURL(`https://www.esrb.org/ratings/${data.certificate}/`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { text } = await request
			.post('https://www.esrb.org/wp-admin/admin-ajax.php')
			.attach({
				action: 'search_rating',
				'args[searchKeyword]': query,
				'args[searchType]': 'All',
				'args[pg]': 1,
				'args[platform][]': 'All Platforms',
				'args[rating][]': 'E,E10+,T,M,AO',
				'args[descriptor]': 'All Content'
			});
		const body = JSON.parse(text);
		if (!body.games.length) return null;
		return body.games[0];
	}
};
