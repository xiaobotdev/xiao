const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber } = require('../../util/Util');

module.exports = class YuGiOhCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh',
			aliases: ['ygo'],
			group: 'search',
			memberName: 'yu-gi-oh',
			description: 'Responds with info on a Yu-Gi-Oh! card.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Konami',
					url: 'https://www.konami.com/en/',
					reason: 'Original "Yu-Gi-Oh!" Game',
					reasonURL: 'https://www.yugioh-card.com/en/'
				},
				{
					name: 'YGOPRODECK',
					url: 'https://ygoprodeck.com/',
					reason: 'API',
					reasonURL: 'https://db.ygoprodeck.com/api-guide/'
				}
			],
			args: [
				{
					key: 'card',
					prompt: 'What card would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { card }) {
		try {
			const { body } = await request
				.get('https://db.ygoprodeck.com/api/v7/cardinfo.php')
				.query({
					fname: card,
					la: 'english'
				});
			const data = body.data[0];
			const embed = new MessageEmbed()
				.setColor(0xBE5F1F)
				.setTitle(data.name)
				.setURL(`https://db.ygoprodeck.com/card/?search=${data.id}`)
				.setDescription(data.type === 'Normal Monster' ? `_${shorten(data.desc)}_` : shorten(data.desc))
				.setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/AJNBflD.png', 'http://www.yugioh-card.com/')
				.setThumbnail(data.card_images[0].image_url)
				.setFooter(data.id)
				.addField('❯ Type', data.type, true)
				.addField(data.type.includes('Monster') ? '❯ Race' : '❯ Spell Type', data.race, true);
			if (data.type.includes('Monster')) {
				embed
					.addField('❯ Attribute', data.attribute, true)
					.addField('❯ Level', data.level || 'N/A', true)
					.addField('❯ ATK', formatNumber(data.atk), true)
					.addField(
						data.type === 'Link Monster' ? '❯ Link Value' : '❯ DEF',
						formatNumber(data.type === 'Link Monster' ? data.linkval : data.def),
						true
					);
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
