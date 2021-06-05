const Command = require('../../framework/Command');
const signs = require('../../assets/json/chinese-zodiac');

module.exports = class ChineseZodiacCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chinese-zodiac',
			aliases: ['chinese-zodiac-sign', 'c-zodiac', 'c-zodiac-sign'],
			group: 'analyze',
			memberName: 'chinese-zodiac',
			description: 'Responds with the Chinese Zodiac Sign for the given year.',
			args: [
				{
					key: 'year',
					prompt: 'What year would you like to get the Chinese Zodiac Sign for?',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	run(msg, { year }) {
		return msg.say(`The Chinese Zodiac Sign for ${year} is ${signs[year % signs.length]}.`);
	}
};
