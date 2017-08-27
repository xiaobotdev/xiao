const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class YuGiOhCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yu-gi-oh',
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

	async run(msg, args) {
		const { query } = args;
		try {
			const { body } = await snekfetch
				.get(`http://yugiohprices.com/api/card_data/${query}`);
			if (body.status === 'fail') return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0xBE5F1F)
				.setTitle(body.data.name)
				.setDescription(body.data.text)
				.setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/7gPm9Rr.png')
				.addField('❯ Card Type',
					body.data.card_type, true);
			if (body.data.card_type === 'monster') {
				embed
					.addField('❯ Type',
						body.data.type, true)
					.addField('❯ Attribute',
						body.data.family, true)
					.addField('❯ ATK',
						body.data.atk, true)
					.addField('❯ DEF',
						body.data.def, true)
					.addField('❯ Level',
						body.data.level, true);
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
