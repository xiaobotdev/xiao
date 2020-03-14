const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { shorten } = require('../../util/Util');

module.exports = class RightStufCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'right-stuf',
			aliases: ['right-stuf-anime'],
			group: 'search',
			memberName: 'right-stuf',
			description: 'Searches Right Stuf Anime for your query.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Right Stuf Anime',
					url: 'https://www.rightstufanime.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What product would you like to search for?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get('https://www.rightstufanime.com/api/items')
				.query({
					country: 'US',
					currency: 'USD',
					fieldset: 'search',
					include: '',
					language: 'en',
					limit: 1,
					pricelevel: 2,
					q: query,
					sort: 'relevance:asc',
					custitem_rs_adult: Boolean(msg.channel.nsfw)
				});
			if (!body.items.length) return msg.say('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xEE3F3C)
				.setTitle(data.storedisplayname)
				.setURL(`https://www.rightstufanime.com/${data.urlcomponent}`)
				.setAuthor('Right Stuf', 'https://i.imgur.com/CTB8Imp.jpg', 'https://www.rightstufanime.com/')
				.setDescription(shorten(data.storedescription))
				.setThumbnail(this.getImageURL(data))
				.addField('❯ Price', stripIndents`
					Retail Price: ${data.pricelevel1_formatted}
					Non-Member Price: ${data.pricelevel5_formatted}
					Member Price: ${data.pricelevel3_formatted}
				`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	getImageURL(item) {
		let found = null;
		let current = item.itemimages_detail;
		while (!found) {
			if (current.primary) found = current.primary.url;
			if (current.urls) found = current.urls[0].url;
			const key = Object.keys(current)[0];
			if (!key) break;
			current = current[key];
		}
		return found;
	}
};
