const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { isUrlNSFW } = require('../../util/Util');
const sagiri = require('sagiri');
const { SAUCENAO_KEY } = process.env;
const sagiriClient = sagiri(SAUCENAO_KEY);

module.exports = class SauceNaoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'saucenao',
			aliases: ['sauce', 'source'],
			group: 'analyze',
			memberName: 'saucenao',
			description: 'Finds the source for artwork.',
			credit: [
				{
					name: 'SauceNAO',
					url: 'https://saucenao.com/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'image',
					type: 'image'
				}
			]
		});
	}

	async run(msg, { image }) {
		let data;
		try {
			data = await sagiriClient(image);
		} catch {
			return msg.reply('No results for this image.');
		}
		if (!data.length) return msg.reply('No results for this image.');
		const sauce = data[0];
		if (!msg.channel.nsfw) {
			const nsfw = await isUrlNSFW(sauce.url, this.client.adultSiteList);
			if (nsfw) return msg.reply('The result was NSFW.');
		}
		const embed = new MessageEmbed()
			.setImage(sauce.thumbnail)
			.setURL(sauce.url)
			.setAuthor(sauce.authorName || 'Unknown Author', undefined, sauce.authorUrl || sauce.url)
			.setFooter(`${sauce.similarity}% similarity`);
		return msg.reply({ embeds: [embed] });
	}
};
