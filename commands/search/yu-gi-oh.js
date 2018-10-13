const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, formatNumber, firstUpperCase } = require('../../util/Util');

module.exports = class YuGiOhCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh',
			aliases: ['yu-gi-oh-card', 'ygo-card', 'ygo'],
			group: 'search',
			memberName: 'yu-gi-oh',
			description: 'Responds with info on a Yu-Gi-Oh! card.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'card',
					prompt: 'What card would you like to get information on?',
					type: 'string',
					parse: card => encodeURIComponent(card)
				}
			]
		});
	}

	async run(msg, { card }) {
		try {
			const { body } = await request.get(`https://yugiohprices.com/api/card_data/${card}`);
			if (body.status === 'fail') return msg.say('Could not find any results.');
			const image = await request.get(`https://yugiohprices.com/api/card_image/${card}`);
			const { data } = body;
			const embed = new MessageEmbed()
				.attachFiles([{ attachment: image.body, name: 'thumbnail.jpg' }])
				.setColor(0xBE5F1F)
				.setTitle(data.name)
				.setDescription(shorten(data.text))
				.setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/AJNBflD.png', 'http://www.yugioh-card.com/')
				.setThumbnail('attachment://thumbnail.jpg')
				.addField('❯ Card Type', firstUpperCase(data.card_type), true);
			if (data.card_type === 'monster') {
				embed
					.addField('❯ Species', data.type, true)
					.addField('❯ Attribute', firstUpperCase(data.family), true)
					.addField('❯ Level', data.level, true)
					.addField('❯ ATK', formatNumber(data.atk), true)
					.addField('❯ DEF', formatNumber(data.def), true);
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
