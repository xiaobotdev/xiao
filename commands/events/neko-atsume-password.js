const Command = require('../../structures/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { list, duration, tomorrow } = require('../../util/Util');
const { GOLD_FISH_EMOJI_ID, SILVER_FISH_EMOJI_ID } = process.env;
const locales = ['en', 'jp'];

module.exports = class NekoAtsumePasswordCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'neko-atsume-password',
			aliases: ['neko-atsume', 'neko-password', 'neko-atsume-pswd', 'neko-pswd'],
			group: 'events',
			memberName: 'neko-atsume-password',
			description: 'Responds with today\'s Neko Atsume password.',
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
				It will expire in **${duration(data.expires - data.date)}**.

				${data.gold} ${this.goldFish} ${data.silver} ${this.silverFish}
			`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchPassword(locale) {
		const { text } = await request
			.get(`http://hpmobile.jp/app/nekoatsume/neko_daily${locale !== 'jp' ? `_${locale}` : ''}.php`);
		const data = text.split(',');
		const date = new Date();
		date.setUTCHours(date.getUTCHours() + 9);
		return {
			password: data[1],
			silver: data[2],
			gold: data[3],
			date,
			expires: tomorrow(9)
		};
	}

	get goldFish() {
		return GOLD_FISH_EMOJI_ID ? `<:gold_fish:${GOLD_FISH_EMOJI_ID}>` : 'Gold Fish';
	}

	get silverFish() {
		return SILVER_FISH_EMOJI_ID ? `<:silver_fish:${SILVER_FISH_EMOJI_ID}>` : 'Silver Fish';
	}
};
