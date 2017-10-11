const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten, duration } = require('../../structures/Util');

module.exports = class VocaloidCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vocaloid',
			aliases: ['vocadb', 'vocaloid-song', 'vocaloid-music'],
			group: 'search',
			memberName: 'vocaloid',
			description: 'Searches VocaDB for your query.',
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
			const { body } = await snekfetch
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
			const { minutes, seconds } = duration(data.lengthSeconds * 1000);
			const embed = new MessageEmbed()
				.setColor(0x86D2D0)
				.setAuthor('VocaDB', 'https://i.imgur.com/6QwraDT.jpg')
				.setTitle(data.name)
				.setURL(`http://vocadb.net/S/${data.id}`)
				.setDescription(data.lyrics.length ? shorten(data.lyrics[0].value) : 'N/A')
				.setThumbnail(data.thumbUrl)
				.addField('❯ Artist',
					data.artistString)
				.addField('❯ Publish Date',
					new Date(data.publishDate).toDateString(), true)
				.addField('❯ Length',
					`${minutes}:${seconds}`, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
