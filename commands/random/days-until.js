const Command = require('../../structures/Command');

module.exports = class DaysUntilCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'days-until',
			aliases: ['days-until-christmas'],
			group: 'random',
			memberName: 'days-until',
			description: 'Get how many days until a certain date this year.',
			args: [
				{
					key: 'date',
					prompt: 'What date do you want events for? Month/Day format.',
					type: 'string',
					default: ['12', '25'],
					parse: date => date.split('/')
				}
			]
		});
	}

	run(msg, { date }) {
		const month = parseInt(date[0], 10);
		const day = date[1] ? parseInt(date[1], 10) : NaN;
		const now = new Date();
		let year = now.getMonth() + 1 <= month ? now.getFullYear() : now.getFullYear() + 1;
		if (month === now.getMonth() + 1 && now.getDate() >= day) ++year;
		const future = new Date(`${month}/${day}/${year}`);
		const time = Math.round((future - now) / (1000 * 60 * 60 * 24)) + 1;
		return msg.say(`There are ${time || 'N/A'} days until ${future.toDateString()}!`);
	}
};
