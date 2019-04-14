const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { list } = require('../../util/Util');
const codes = require('../../assets/json/translate');
const { YANDEX_KEY } = process.env;

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['yandex', 'yandex-translate'],
			group: 'text-edit',
			memberName: 'translate',
			description: 'Translates text to a specific language.',
			details: `**Codes:** ${Object.keys(codes).join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Yandex.Translate API',
					url: 'https://tech.yandex.com/translate/doc/dg/reference/translate-docpage/'
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
					default: '',
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
			const { body } = await request
				.get('https://translate.yandex.net/api/v1.5/tr.json/translate')
				.query({
					key: YANDEX_KEY,
					text,
					lang: base ? `${base}-${target}` : target
				});
			const lang = body.lang.split('-');
			const embed = new MessageEmbed()
				.setColor(0xFF0000)
				.setFooter('Powered by Yandex.Translate', 'https://i.imgur.com/HMpH9sq.png')
				.addField(`❯ From: ${codes[lang[0]]}`, text)
				.addField(`❯ To: ${codes[lang[1]]}`, body.text[0]);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
