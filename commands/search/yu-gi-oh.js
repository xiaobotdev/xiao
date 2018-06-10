const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
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
					key: 'card',
					prompt: 'What card would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { card }) {
		try {
			const { text } = await request
				.get('https://www.ygohub.com/api/card_info')
				.query({ name: card });
			const body = JSON.parse(text);
			if (body.status === 'error') return msg.say('Could not find any results.');
			const data = body.card;
			const embed = new MessageEmbed()
				.setColor(0xBE5F1F)
				.setTitle(data.name)
				.setDescription(shorten(data.text))
				.setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/AJNBflD.png', 'http://www.yugioh-card.com/')
				.setURL(data.tcgplayer_link)
				.setThumbnail(data.image_path)
				.addField('❯ Card Type', data.type, true);
			if (data.is_monster) {
				embed
					.addField('❯ Species', data.species, true)
					.addField('❯ Attribute', data.attribute, true)
					.addField('❯ Level', data.stars, true)
					.addField('❯ ATK', data.attack, true)
					.addField('❯ DEF', data.defense, true);
			}
			embed.addField('❯ Legality', stripIndents`
				TCG Advanced: ${data.legality.TCG.Advanced}
				TCG Traditional: ${data.legality.TCG.Traditional}
				OCG Advanced: ${data.legality.OCG.Advanced}
			`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
