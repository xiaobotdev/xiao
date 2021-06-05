const Command = require('../../framework/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');
const { WATTPAD_KEY } = process.env;

module.exports = class WattpadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wattpad',
			group: 'search',
			memberName: 'wattpad',
			description: 'Searches Wattpad for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Wattpad',
					url: 'https://www.wattpad.com/',
					reason: 'API',
					reasonURL: 'https://www.wattpad.com/developer/docs/api'
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
				.get('https://api.wattpad.com/v4/stories')
				.query({
					query,
					limit: 1
				})
				.set({ Authorization: `Basic ${WATTPAD_KEY}` });
			if (!body.stories.length) return msg.say('Could not find any results.');
			const data = body.stories[0];
			const embed = new MessageEmbed()
				.setColor(0xF89C34)
				.setAuthor('Wattpad', 'https://i.imgur.com/lFTXnlz.png', 'https://www.wattpad.com/')
				.setURL(data.url)
				.setTitle(data.title)
				.setDescription(shorten(data.description))
				.setThumbnail(data.cover)
				.addField('❯ Creation Date', moment.utc(data.createDate).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Author', data.user.name, true)
				.addField('❯ Chapters', formatNumber(data.numParts), true)
				.addField('❯ Reads', formatNumber(data.readCount), true)
				.addField('❯ Votes', formatNumber(data.voteCount), true)
				.addField('❯ Comments', formatNumber(data.commentCount), true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
