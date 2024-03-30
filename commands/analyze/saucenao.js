const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
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
		const data = await sagiriClient(image);
		if (!data.length) return msg.reply('No results for this image.');
		const sauce = data[0];
		const embed = new MessageEmbed()
			.setImage(sauce.thumbnail)
			.setURL(sauce.url)
			.setAuthor(sauce.authorName || 'Unknown Author', sauce.authorUrl || sauce.url)
			.setFooter(`${sauce.similarity}% similarity`);
		return msg.reply({ embeds: [embed] });
	}
};
