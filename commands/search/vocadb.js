const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten } = require('../../util/Util');

module.exports = class VocadbCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocadb',
			aliases: ['vocaloid'],
			group: 'search',
			memberName: 'vocadb',
			description: 'Searches VocaDB for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'VocaDB',
					url: 'https://vocadb.net/',
					reason: 'API',
					reasonURL: 'https://vocadb.net/swagger/ui/index'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What song would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('http://vocadb.net/api/songs')
				.query({
					query,
					maxResults: 1,
					sort: 'FavoritedTimes',
					preferAccurateMatches: true,
					nameMatchMode: 'Words',
					fields: 'ThumbUrl,Lyrics'
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0x86D2D0)
				.setAuthor('VocaDB', 'https://i.imgur.com/6QwraDT.jpg', 'http://vocadb.net/')
				.setTitle(data.name)
				.setURL(`http://vocadb.net/S/${data.id}`)
				.setDescription(data.lyrics.length ? shorten(data.lyrics[0].value) : 'No lyrics available.')
				.setThumbnail(data.thumbUrl)
				.addField('❯ Artist', data.artistString)
				.addField('❯ Publish Date', moment.utc(data.publishDate).format('MM/DD/YYYY'), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
