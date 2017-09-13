const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { list } = require('../../structures/Util');
const codes = require('../../assets/json/translate');
const { YANDEX_KEY } = process.env;

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			group: 'text-edit',
			memberName: 'translate',
			description: 'Translates text to a specified language.',
			details: `**Codes:** ${Object.keys(codes).join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to translate?',
					type: 'string',
					validate: text => {
						if (text.length < 500) return true;
						return 'Invalid text, please keep the text under 500 characters.';
					}
				},
				{
					key: 'target',
					prompt: `Which language would you like to translate to? Either ${list(Object.keys(codes), 'or')}.`,
					type: 'string',
					validate: target => {
						if (codes[target.toLowerCase()] || Object.values(codes).includes(target)) return true;
						return `Invalid target, please enter either ${list(Object.keys(codes), 'or')}.`;
					},
					parse: target => {
						if (codes[target.toLowerCase()]) return target.toLowerCase();
						return Object.keys(codes).find(key => codes[key] === target);
					}
				},
				{
					key: 'base',
					prompt: `Which language would you like to use as the base? Either ${list(Object.keys(codes), 'or')}.`,
					type: 'string',
					default: '',
					validate: base => {
						if (codes[base.toLowerCase()] || Object.values(codes).includes(base)) return true;
						return `Invalid base, please enter either ${list(Object.keys(codes), 'or')}.`;
					},
					parse: base => {
						if (codes[base.toLowerCase()]) return base.toLowerCase();
						return Object.keys(codes).find(key => codes[key] === base);
					}
				}
			]
		});
	}

	async run(msg, args) {
		const { text, target, base } = args;
		try {
			const { body } = await snekfetch
				.get('https://translate.yandex.net/api/v1.5/tr.json/translate')
				.query({
					key: YANDEX_KEY,
					text,
					lang: base ? `${base}-${target}` : target
				});
			const lang = body.lang.split('-');
			const embed = new MessageEmbed()
				.setColor(0x00AE86)
				.addField(`❯ From: ${codes[lang[0]]}`,
					text)
				.addField(`❯ To: ${codes[lang[1]]}`,
					body.text[0]);
			return msg.embed(embed);
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
