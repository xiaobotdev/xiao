const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');
const { list, tomorrow } = require('../../util/Util');
const { GOLD_FISH_EMOJI_ID, GOLD_FISH_EMOJI_NAME, SILVER_FISH_EMOJI_ID, SILVER_FISH_EMOJI_NAME } = process.env;
const locales = ['en', 'jp'];

module.exports = class NekoAtsumePasswordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neko-atsume-password',
			aliases: ['neko-atsume', 'neko-password', 'neko-atsume-pswd', 'neko-pswd'],
			group: 'events',
			memberName: 'neko-atsume-password',
			description: 'Responds with today\'s Neko Atsume password.',
			details: `**Locales:** ${locales.join(', ')}`,
			credit: [
				{
					name: 'Neko Atsume: Kitty Collector',
					url: 'http://nekoatsume.com/en/',
					reason: 'API, Original Game'
				},
				{
					name: 'jasmaa',
					url: 'https://github.com/jasmaa/',
					reason: 'API URL',
					reasonURL: 'https://github.com/jasmaa/nekoatsume-password-learner/blob/master/neko_pswd.py#L4'
				}
			],
			args: [
				{
					key: 'locale',
					prompt: `What locale do you want to use? Either ${list(locales, 'or')}.`,
					type: 'string',
					default: 'en',
					oneOf: locales,
					parse: locale => locale.toLowerCase()
				}
			]
		});
	}

	async run(msg, { locale }) {
		try {
			const data = await this.fetchPassword(locale);
			return msg.say(stripIndents`
				The current Neko Atsume password is **${data.password}**.
				It will expire in **${moment.duration(data.expires - data.date).format('hh:mm:ss', { trim: false })}**.

				${data.gold} ${this.goldFishEmoji} ${data.silver} ${this.silverFishEmoji}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPassword(locale) {
		const { text } = await request
			.get(`http://hpmobile.jp/app/nekoatsume/neko_daily${locale === 'jp' ? '' : `_${locale}`}.php`);
		const data = text.split(',');
		const date = new Date();
		date.setUTCHours(9);
		return {
			password: data[1],
			silver: data[2],
			gold: data[3],
			date,
			expires: tomorrow(9)
		};
	}

	get goldFishEmoji() {
		return GOLD_FISH_EMOJI_ID && GOLD_FISH_EMOJI_NAME
			? `<:${GOLD_FISH_EMOJI_NAME}:${GOLD_FISH_EMOJI_ID}>`
			: 'Gold Fish';
	}

	get silverFishEmoji() {
		return SILVER_FISH_EMOJI_ID && SILVER_FISH_EMOJI_ID
			? `<:${SILVER_FISH_EMOJI_NAME}:${SILVER_FISH_EMOJI_ID}>`
			: 'Silver Fish';
	}
};
