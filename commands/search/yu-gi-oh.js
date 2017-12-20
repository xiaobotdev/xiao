const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');

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
					key: 'query',
					prompt: 'What card would you like to get information on?',
					type: 'string',
					parse: text => encodeURIComponent(text)
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch.get(`https://yugiohprices.com/api/card_data/${query}`);
			if (body.status === 'fail') return msg.say('Could not find any results.');
			const image = await snekfetch.get(`https://yugiohprices.com/api/card_image/${query}`);
			const { data } = body;
			const embed = new MessageEmbed()
				.attachFiles([{ attachment: image.body, name: 'thumbnail.jpg' }])
				.setColor(0xBE5F1F)
				.setTitle(data.name)
				.setDescription(shorten(data.text))
				.setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/AJNBflD.png')
				.setThumbnail('attachment://thumbnail.jpg')
				.addField('❯ Card Type',
					data.card_type, true);
			if (data.card_type === 'monster') {
				embed
					.addField('❯ Type',
						data.type, true)
					.addField('❯ Attribute',
						data.family, true)
					.addField('❯ Level',
						data.level, true)
					.addField('❯ ATK',
						data.atk, true)
					.addField('❯ DEF',
						data.def, true);
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
