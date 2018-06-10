const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const signs = require('../../assets/json/horoscope');

module.exports = class HoroscopeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'horoscope',
			group: 'events',
			memberName: 'horoscope',
			description: 'Responds with today\'s horoscope for a specific Zodiac sign.',
			details: `**Signs**: ${signs.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'sign',
					prompt: `Which sign would you like to get the horoscope for? Either ${list(signs, 'or')}.`,
					type: 'string',
					oneOf: signs,
					parse: sign => sign.toLowerCase()
				}
			]
		});
	}

	async run(msg, { sign }) {
		try {
			const { body } = await request.get(`http://theastrologer-api.herokuapp.com/api/horoscope/${sign}/today`);
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setTitle(`Horoscope for ${body.sunsign}...`)
				.setURL(`https://new.theastrologer.com/${body.sunsign}/`)
				.setFooter('© Kelli Fox, The Astrologer')
				.setTimestamp()
				.setDescription(body.horoscope)
				.addField('❯ Mood', body.meta.mood, true)
				.addField('❯ Intensity', body.meta.intensity, true)
				.addField('❯ Date', body.date, true);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
