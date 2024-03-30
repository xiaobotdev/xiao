const Command = require('../../framework/Command');
const numerals = require('../../assets/json/roman');

module.exports = class RomanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roman',
			aliases: ['roman-numeral'],
			group: 'edit-number',
			memberName: 'roman',
			description: 'Converts a number to roman numerals.',
			args: [
				{
					key: 'number',
					type: 'integer',
					min: -3999999,
					max: 3999999
				}
			]
		});
	}

	run(msg, { number }) {
		if (number === 0) return msg.reply('_nulla_');
		let negative = false;
		if (number < 0) {
			negative = true;
			number = Math.abs(number);
		}
		let result = '';
		for (const [numeral, value] of Object.entries(numerals)) {
			while (number >= value) {
				result += numeral;
				number -= value;
			}
		}
		return msg.reply(`${negative ? '-' : ''}${result}`);
	}
};
