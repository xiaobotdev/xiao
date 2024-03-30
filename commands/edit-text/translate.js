const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const { list } = require('../../util/Util');
const codes = Object.keys(translate.languages).filter(code => typeof translate.languages[code] !== 'function');

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['google-translate'],
			group: 'edit-text',
			memberName: 'translate',
			description: 'Translates text to a specific language.',
			details: `**Codes:** ${codes.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Google',
					url: 'https://www.google.com/',
					reason: 'Google Translate',
					reasonURL: 'https://translate.google.com/'
				}
			],
			args: [
				{
					key: 'text',
					type: 'string',
					max: 500
				},
				{
					key: 'target',
					type: 'string',
					validate: target => {
						if (translate.languages.isSupported(target)) return true;
						return `Invalid target, please enter either ${list(codes, 'or')}.`;
					},
					parse: target => translate.languages.getCode(target)
				},
				{
					key: 'base',
					type: 'string',
					default: 'auto',
					validate: base => {
						if (translate.languages.isSupported(base)) return true;
						return `Invalid base, please enter either ${list(codes, 'or')}.`;
					},
					parse: base => translate.languages.getCode(base)
				}
			]
		});
	}

	async run(msg, { text, target, base }) {
		const { text: result, from } = await translate(text, { to: target, from: base });
		const embed = new MessageEmbed()
			.setColor(0x4285F4)
			.setFooter('Powered by Google Translate', 'https://i.imgur.com/h3RoHyp.png')
			.addField(`❯ From: ${translate.languages[from.language.iso]}`, from.text.value || text)
			.addField(`❯ To: ${translate.languages[target]}`, result);
		return msg.embed(embed);
	}
};
