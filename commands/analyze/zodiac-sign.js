const Command = require('../../structures/Command');

module.exports = class ZodiacSignCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'zodiac-sign',
			aliases: ['zodiac'],
			group: 'analyze',
			memberName: 'zodiac-sign',
			description: 'Responds with the Zodiac Sign for the given month/day.',
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get the Zodiac Sign for?',
					type: 'month'
				},
				{
					key: 'day',
					prompt: 'What day would you like to get the Zodiac Sign for?',
					type: 'integer',
					min: 1,
					max: 31
				}
			]
		});
	}

	run(msg, { month, day }) {
		const sign = this.determineSign(month, day);
		if (!sign) return msg.reply('Invalid day.');
		return msg.say(`The Zodiac Sign for ${month}/${day} is ${sign}.`);
	}

	determineSign(month, day) { // eslint-disable-line complexity
		if (month === 1) {
			if (day >= 1 && day <= 19) return 'Capricorn';
			if (day >= 20 && day <= 31) return 'Aquarius';
			return null;
		} else if (month === 2) {
			if (day >= 1 && day <= 18) return 'Aquarius';
			if (day >= 19 && day <= 29) return 'Pisces';
			return null;
		} else if (month === 3) {
			if (day >= 1 && day <= 20) return 'Pisces';
			if (day >= 21 && day <= 31) return 'Aries';
			return null;
		} else if (month === 4) {
			if (day >= 1 && day <= 19) return 'Aries';
			if (day >= 20 && day <= 31) return 'Taurus';
			return null;
		} else if (month === 5) {
			if (day >= 1 && day <= 20) return 'Taurus';
			if (day >= 21 && day <= 31) return 'Gemini';
			return null;
		} else if (month === 6) {
			if (day >= 1 && day <= 20) return 'Gemini';
			if (day >= 21 && day <= 31) return 'Cancer';
			return null;
		} else if (month === 7) {
			if (day >= 1 && day <= 22) return 'Cancer';
			if (day >= 23 && day <= 31) return 'Leo';
			return null;
		} else if (month === 8) {
			if (day >= 1 && day <= 22) return 'Leo';
			if (day >= 23 && day <= 31) return 'Virgo';
			return null;
		} else if (month === 9) {
			if (day >= 1 && day <= 22) return 'Virgo';
			if (day >= 23 && day <= 31) return 'Libra';
			return null;
		} else if (month === 10) {
			if (day >= 1 && day <= 22) return 'Libra';
			if (day >= 23 && day <= 31) return 'Scorpio';
			return null;
		} else if (month === 11) {
			if (day >= 1 && day <= 21) return 'Scorpio';
			if (day >= 22 && day <= 31) return 'Sagittarius';
			return null;
		} else if (month === 12) {
			if (day >= 1 && day <= 21) return 'Sagittarius';
			if (day >= 22 && day <= 31) return 'Capricorn';
			return null;
		} else {
			return null;
		}
	}
};
