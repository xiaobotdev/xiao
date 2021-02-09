const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { firstUpperCase, isLeap } = require('../../util/Util');
const monthsWith30 = [4, 6, 9, 11];
const { months } = require('../../assets/json/month');

module.exports = class CalendarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'calendar',
			aliases: ['cal'],
			group: 'events',
			memberName: 'calendar',
			description: 'Responds with the calendar for a specific month and year.',
			args: [
				{
					key: 'month',
					prompt: 'What month would you like to get the calendar of?',
					type: 'month'
				},
				{
					key: 'year',
					prompt: 'What year would you like to get the calendar of?',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	run(msg, { month, year }) {
		let display = stripIndents`
			${firstUpperCase(months[month - 1])} ${year}
			------------------------------------
			| Su | Mo | Tu | We | Th | Fr | Sa |
			------------------------------------
		`;
		display += '\n';
		let startDay = new Date(year, month - 1, 1);
		if (year < 100) startDay.setFullYear(year);
		startDay = startDay.getDay();
		for (let i = 0; i < startDay; i++) {
			display += '     ';
		}
		const daysInMonth = month === 2 ? isLeap(year) ? 29 : 28 : monthsWith30.includes(month) ? 30 : 31;
		let currentDay = startDay;
		for (let i = 0; i < daysInMonth; i++) {
			display += `| ${(i + 1).toString().padStart(2, '0')} `;
			if (currentDay === 6 && i + 1 !== daysInMonth) {
				display += '|\n------------------------------------\n';
				currentDay = 0;
			} else {
				currentDay += 1;
			}
		}
		display += '|';
		return msg.code(null, display);
	}
};
