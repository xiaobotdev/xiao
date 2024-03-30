const Command = require('../../framework/Command');
const signs = require('../../assets/json/zodiac-sign');
const monthsWith30 = [4, 6, 9, 11];

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
					type: 'month'
				},
				{
					key: 'day',
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
		return msg.say(`The Zodiac Sign for ${month}/${day} is ${sign.name}.`);
	}

	determineSign(month, day) {
		if (month === 2 && day > 29) return null;
		if (monthsWith30.includes(month) && day > 30) return null;
		if (day < 1 || day > 31) return null;
		return signs.find(sign => {
			if (month === sign.high.month && day <= sign.high.day) return true;
			if (month === sign.low.month && day >= sign.low.day) return true;
			return false;
		});
	}
};
