const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { list } = require('../../util/Util');
const codes = require('../../assets/json/translate');

module.exports = class TranslateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'translate',
			aliases: ['google-translate'],
			group: 'text-edit',
			memberName: 'translate',
			description: 'Translates text to a specified language.',
			details: `**Codes**: ${Object.keys(codes).join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'content',
					label: 'text',
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

	async run(msg, { content, target, base }) {
		try {
			const { text } = await snekfetch
				.get('https://translate.googleapis.com/translate_a/single')
				.query({
					client: 'gtx',
					sl: base,
					tl: target,
					dt: 't',
					q: content
				});
			const body = JSON.parse(text);
			const embed = new MessageEmbed()
				.setColor(0x3174F1)
				.addField(`❯ From: ${codes[body[2]]}`,
					content)
				.addField(`❯ To: ${codes[target]}`,
					body[0][0][0]);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
