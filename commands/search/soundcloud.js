const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');
const { SOUNDCLOUD_KEY } = process.env;

module.exports = class SoundcloudCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'soundcloud',
			aliases: ['soundcloud-song', 'soundcloud-music', 'scloud', 'scloud-song', 'scloud-music', 'sc'],
			group: 'search',
			memberName: 'soundcloud',
			description: 'Searches SoundCloud for your query.',
			clientPermissions: ['EMBED_LINKS'],
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
				.get('http://api.soundcloud.com/tracks')
				.query({
					q: query,
					client_id: SOUNDCLOUD_KEY
				});
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0];
			const embed = new MessageEmbed()
				.setColor(0xFF5500)
				.setAuthor('SoundCloud', 'https://i.imgur.com/ctft3v7.png', 'https://soundcloud.com/')
				.setURL(data.permalink_url)
				.setThumbnail(data.artwork_url)
				.setTitle(data.title)
				.setDescription(data.description ? shorten(data.description) : 'No description available.')
				.addField('❯ Artist', `[${data.user.username}](${data.user.permalink_url})`, true)
				.addField('❯ Release Date', moment.utc(data.created_at).format('MM/DD/YYYY'), true)
				.addField('❯ Genre', data.genre, true)
				.addField('❯ Likes', formatNumber(data.likes_count), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
