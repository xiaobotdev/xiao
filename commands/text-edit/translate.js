const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const { list } = require('../../util/Util');
const codes = translate.languages;

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['google-translate'],
			group: 'text-edit',
			memberName: 'translate',
			description: 'Translates text to a specific language.',
			details: `**Codes:** ${Object.keys(codes).join(', ')}`,
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
					prompt: 'What text would you like to translate?',
					type: 'string',
					max: 500
				},
				{
					key: 'target',
					prompt: `Which language would you like to translate to? Either ${list(Object.keys(codes), 'or')}.`,
					type: 'string',
					validate: target => {
						const value = target.toLowerCase();
						if (codes[value] || Object.keys(codes).find(key => codes[key].toLowerCase() === value)) return true;
						return `Invalid target, please enter either ${list(Object.keys(codes), 'or')}.`;
					},
					parse: target => {
						const value = target.toLowerCase();
						if (codes[value]) return value;
						return Object.keys(codes).find(key => codes[key].toLowerCase() === value);
					}
				},
				{
					key: 'base',
					prompt: `Which language would you like to use as the base? Either ${list(Object.keys(codes), 'or')}.`,
					type: 'string',
					default: 'auto',
					validate: base => {
						const value = base.toLowerCase();
						if (codes[value] || Object.keys(codes).find(key => codes[key].toLowerCase() === value)) return true;
						return `Invalid base, please enter either ${list(Object.keys(codes), 'or')}.`;
					},
					parse: base => {
						const value = base.toLowerCase();
						if (codes[value]) return value;
						return Object.keys(codes).find(key => codes[key].toLowerCase() === value);
					}
				}
			]
		});
	}

	async run(msg, { text, target, base }) {
		try {
			const { text: result, from } = await translate(text, { to: target, from: base });
			const embed = new MessageEmbed()
				.setColor(0x4285F4)
				.setFooter('Powered by Google Translate', 'https://i.imgur.com/h3RoHyp.png')
				.addField(`❯ From: ${codes[from.language.iso]}`, from.text.value || text)
				.addField(`❯ To: ${codes[target]}`, result);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
